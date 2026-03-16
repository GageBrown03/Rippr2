import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { openPacks } from '@/lib/pack-engine';
import { generateCardDescription } from '@/lib/ai-descriptions';
import { openPackSchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const parsed = openPackSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { packId, quantity } = parsed.data;

    // Fetch pack to check cost
    const pack = await prisma.pack.findUnique({ where: { id: packId } });
    if (!pack) {
      return errorResponse('Pack not found', 404);
    }

    const totalCost = pack.cost * quantity;

    // Check user has enough coins (re-fetch for freshness)
    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser || freshUser.coins < totalCost) {
      return errorResponse('Not enough PokéCoins', 400);
    }

    // Open packs (weighted random selection)
    const cards = await openPacks(packId, quantity);

    // Fire-and-forget: generate AI descriptions in background (don't block response)
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

    // Deduct coins and create records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coins
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { coins: { decrement: totalCost } },
      });

      // Record pack opening
      await tx.packOpening.create({
        data: {
          userId: user.id,
          packId,
          quantity,
          coinsSpent: totalCost,
        },
      });

      // Create user cards individually to capture IDs
      const userCardIds: string[] = [];
      for (const card of cards) {
        const uc = await tx.userCard.create({
          data: {
            userId: user.id,
            cardId: card.id,
          },
        });
        userCardIds.push(uc.id);
      }

      return { updatedUser, userCardIds };
    });

    logger.info(`User ${user.username} opened ${quantity} packs of ${pack.name}`);

    return successResponse({
      cards,
      userCardIds: result.userCardIds,
      newCoins: result.updatedUser.coins,
    });
  } catch (error) {
    logger.error('Pack opening error', { error });
    return errorResponse('Internal server error', 500);
  }
}
