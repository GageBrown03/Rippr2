import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { openPacks, rollHoloBleed } from '@/lib/pack-engine';
import { generateCardDescription } from '@/lib/ai-descriptions';
import { openPackSchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = openPackSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { packId, quantity } = parsed.data;

    const pack = await prisma.pack.findUnique({ where: { id: packId } });
    if (!pack) return errorResponse('Pack not found', 404);

    const totalCost = pack.cost * quantity;

    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser || freshUser.coins < totalCost) {
      return errorResponse('Not enough PokéCoins', 400);
    }

    // Use luck modifier for card selection
    const cards = await openPacks(packId, quantity, freshUser.luckModifier);

    // Fire-and-forget AI descriptions
    const cardsNeedingText = cards.filter((c) => !c.flavorText).slice(0, 3);
    if (cardsNeedingText.length > 0) {
      Promise.allSettled(
        cardsNeedingText.map(async (card) => {
          try {
            const description = await generateCardDescription(card.name, card.type);
            await prisma.card.update({ where: { id: card.id }, data: { flavorText: description } });
          } catch {}
        })
      ).catch(() => {});
    }

    // Roll holo-bleeds for each card
    const holoBleedFlags = cards.map((card) => rollHoloBleed(card.rarity, freshUser.luckModifier));

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { coins: { decrement: totalCost } },
      });

      await tx.packOpening.create({
        data: { userId: user.id, packId, quantity, coinsSpent: totalCost },
      });

      const userCardIds: string[] = [];
      for (let i = 0; i < cards.length; i++) {
        const uc = await tx.userCard.create({
          data: {
            userId: user.id,
            cardId: cards[i].id,
            isHoloBleed: holoBleedFlags[i],
          },
        });
        userCardIds.push(uc.id);
      }

      return { updatedUser, userCardIds };
    });

    const holoBleedCount = holoBleedFlags.filter(Boolean).length;
    if (holoBleedCount > 0) {
      logger.info(`User ${freshUser.username} got ${holoBleedCount} HOLO BLEED card(s)!`);
    }

    logger.info(`User ${freshUser.username} opened ${quantity} packs of ${pack.name}`);

    return successResponse({
      cards,
      userCardIds: result.userCardIds,
      holoBleedFlags,
      newCoins: result.updatedUser.coins,
    });
  } catch (error) {
    logger.error('Pack opening error', { error });
    return errorResponse('Internal server error', 500);
  }
}
