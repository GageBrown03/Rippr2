import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const VAULT_REWARDS = {
  stardust: 500,
  deltaEnergy: 2,
  coins: 5000,
};

const vaultSchema = z.object({
  setName: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = vaultSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { setName } = parsed.data;

    // Check if already vaulted
    const existing = await prisma.completedSet.findUnique({
      where: { userId_setName: { userId: user.id, setName } },
    });
    if (existing) return errorResponse('This set is already vaulted', 400);

    // Verify completion: get all non-vaultOnly cards in this set
    const pack = await prisma.pack.findFirst({
      where: { setName },
      include: {
        cards: {
          where: { vaultOnly: false },
          select: { id: true },
        },
      },
    });
    if (!pack) return errorResponse('Set not found', 404);

    const totalCards = pack.cards.length;
    if (totalCards === 0) return errorResponse('Set has no cards', 400);

    const userCards = await prisma.userCard.findMany({
      where: { userId: user.id, cardId: { in: pack.cards.map((c) => c.id) } },
      select: { cardId: true },
    });
    const uniqueOwned = new Set(userCards.map((uc) => uc.cardId));

    if (uniqueOwned.size < totalCards) {
      return errorResponse(`Set not complete. You have ${uniqueOwned.size}/${totalCards} unique cards.`, 400);
    }

    // Check if there's a vault-exclusive reward card for this set
    const vaultCard = await prisma.card.findFirst({
      where: { packId: pack.id, vaultOnly: true },
    });

    const result = await prisma.$transaction(async (tx) => {
      // Mark set as completed
      await tx.completedSet.create({
        data: { userId: user.id, setName },
      });

      // Award rewards
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          stardustBalance: { increment: VAULT_REWARDS.stardust },
          deltaEnergy: { increment: VAULT_REWARDS.deltaEnergy },
          coins: { increment: VAULT_REWARDS.coins },
        },
      });

      // Mint vault-exclusive card if one exists
      let rewardCard = null;
      if (vaultCard) {
        const uc = await tx.userCard.create({
          data: { userId: user.id, cardId: vaultCard.id },
        });
        rewardCard = { userCardId: uc.id, cardName: vaultCard.name, imageUrl: vaultCard.imageUrl };
      }

      return { updatedUser, rewardCard };
    });

    return successResponse({
      setName,
      rewards: VAULT_REWARDS,
      rewardCard: result.rewardCard,
      newCoins: result.updatedUser.coins,
      newStardustBalance: result.updatedUser.stardustBalance,
      newDeltaEnergy: result.updatedUser.deltaEnergy,
    });
  } catch (error) {
    console.error('Vault complete error:', error);
    return errorResponse('Internal server error', 500);
  }
}
