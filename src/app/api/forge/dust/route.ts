import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const DUST_VALUES: Record<string, number> = {
  Common: 5,
  Uncommon: 10,
  Rare: 20,
  'Holo Rare': 50,
  'Ultra Rare': 100,
};

const dustSchema = z.object({
  userCardIds: z.array(z.string()).min(1, 'Select at least one card'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = dustSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { userCardIds } = parsed.data;

    // Fetch the cards to dust (must belong to user, not showcased, not graded)
    const cards = await prisma.userCard.findMany({
      where: { id: { in: userCardIds }, userId: user.id, showcase: false, grade: null },
      include: { card: true },
    });

    if (cards.length === 0) return errorResponse('No valid cards to dust (showcased and graded cards are protected)', 400);

    const totalStardust = cards.reduce((sum, uc) => sum + (DUST_VALUES[uc.card.rarity] || 5), 0);

    const result = await prisma.$transaction(async (tx) => {
      await tx.userCard.deleteMany({ where: { id: { in: cards.map((c) => c.id) } } });
      return tx.user.update({
        where: { id: user.id },
        data: { stardustBalance: { increment: totalStardust } },
      });
    });

    return successResponse({
      cardsDusted: cards.length,
      stardustEarned: totalStardust,
      newStardustBalance: result.stardustBalance,
    });
  } catch (error) {
    console.error('Dust error:', error);
    return errorResponse('Internal server error', 500);
  }
}
