import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const LUCK_BOOST_PER_PRESTIGE = 0.05; // +5% rare boost per prestiged set

const prestigeSchema = z.object({
  setName: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = prestigeSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { setName } = parsed.data;

    // Must be vaulted first
    const completedSet = await prisma.completedSet.findUnique({
      where: { userId_setName: { userId: user.id, setName } },
    });
    if (!completedSet) return errorResponse('Set must be vaulted before prestiging', 400);
    if (completedSet.prestiged) return errorResponse('This set is already prestiged', 400);

    // Get all cards in this set
    const pack = await prisma.pack.findFirst({
      where: { setName },
      include: { cards: { select: { id: true } } },
    });
    if (!pack) return errorResponse('Set not found', 404);

    const cardIds = pack.cards.map((c) => c.id);

    // Count cards that will be wiped (non-showcased from this set)
    const cardsToWipe = await prisma.userCard.findMany({
      where: { userId: user.id, cardId: { in: cardIds }, showcase: false },
      select: { id: true },
    });

    const result = await prisma.$transaction(async (tx) => {
      // Delete all non-showcased cards from this set
      await tx.userCard.deleteMany({
        where: { userId: user.id, cardId: { in: cardIds }, showcase: false },
      });

      // Mark set as prestiged
      await tx.completedSet.update({
        where: { userId_setName: { userId: user.id, setName } },
        data: { prestiged: true },
      });

      // Add to user's prestigedSets array and boost luck
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          prestigedSets: { push: setName },
          luckModifier: { increment: LUCK_BOOST_PER_PRESTIGE },
          stardustBalance: { increment: 1000 }, // bonus stardust
        },
      });

      return updatedUser;
    });

    return successResponse({
      setName,
      cardsWiped: cardsToWipe.length,
      newLuckModifier: result.luckModifier,
      totalPrestigedSets: result.prestigedSets.length,
      bonusStardust: 1000,
      newStardustBalance: result.stardustBalance,
    });
  } catch (error) {
    console.error('Prestige error:', error);
    return errorResponse('Internal server error', 500);
  }
}
