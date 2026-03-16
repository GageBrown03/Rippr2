import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    // Get all packs (sets)
    const packs = await prisma.pack.findMany({
      include: {
        cards: {
          where: { vaultOnly: false },
          select: { id: true, name: true, rarity: true },
        },
      },
    });

    // Get user's unique card IDs
    const userCards = await prisma.userCard.findMany({
      where: { userId: user.id },
      select: { cardId: true },
    });
    const ownedCardIds = new Set(userCards.map((uc) => uc.cardId));

    // Get completed sets
    const completedSets = await prisma.completedSet.findMany({
      where: { userId: user.id },
    });
    const completedSetNames = new Set(completedSets.map((cs) => cs.setName));

    // Build progress for each set
    const setProgress = packs.map((pack) => {
      const totalCards = pack.cards.length;
      const ownedCount = pack.cards.filter((c) => ownedCardIds.has(c.id)).length;
      const missingCards = pack.cards
        .filter((c) => !ownedCardIds.has(c.id))
        .map((c) => ({ id: c.id, name: c.name, rarity: c.rarity }));

      return {
        packId: pack.id,
        setName: pack.setName,
        packName: pack.name,
        totalCards,
        ownedCount,
        percentage: totalCards > 0 ? Math.round((ownedCount / totalCards) * 100) : 0,
        isComplete: ownedCount >= totalCards && totalCards > 0,
        isVaulted: completedSetNames.has(pack.setName),
        missingCards: missingCards.slice(0, 10), // limit for response size
      };
    });

    return successResponse(setProgress);
  } catch (error) {
    console.error('Vault check error:', error);
    return errorResponse('Internal server error', 500);
  }
}
