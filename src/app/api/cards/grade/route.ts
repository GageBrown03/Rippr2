import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const GRADE_COST_STARDUST = 25;

// Weighted grades: higher rarities have slightly lower chance of 10
// Format: [grade, weight] — higher weight = more likely
const BASE_WEIGHTS: [number, number][] = [
  [1, 2], [2, 3], [3, 5], [4, 8], [5, 12],
  [6, 15], [7, 18], [8, 16], [9, 12], [10, 9],
];

// Rarity penalty to grade 10 chance
const RARITY_10_PENALTY: Record<string, number> = {
  Common: 0,      // full chance at 10
  Uncommon: 1,    // slightly less
  Rare: 2,
  'Holo Rare': 3,
  'Ultra Rare': 4, // hardest to get a pristine 10
};

function rollGrade(rarity: string): number {
  const penalty = RARITY_10_PENALTY[rarity] || 0;
  const weights = BASE_WEIGHTS.map(([grade, weight]) => {
    if (grade === 10) return [grade, Math.max(1, weight - penalty)] as [number, number];
    return [grade, weight] as [number, number];
  });

  const totalWeight = weights.reduce((sum, [, w]) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const [grade, weight] of weights) {
    random -= weight;
    if (random <= 0) return grade;
  }
  return 7; // fallback
}

const gradeSchema = z.object({ userCardId: z.string().min(1) });

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = gradeSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { userCardId } = parsed.data;

    const userCard = await prisma.userCard.findFirst({
      where: { id: userCardId, userId: user.id },
      include: { card: true },
    });

    if (!userCard) return errorResponse('Card not found in your collection', 404);
    if (userCard.grade !== null) return errorResponse('This card is already graded', 400);

    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser || freshUser.stardustBalance < GRADE_COST_STARDUST) {
      return errorResponse(`Not enough Stardust. Need ${GRADE_COST_STARDUST}, have ${freshUser?.stardustBalance || 0}`, 400);
    }

    const grade = rollGrade(userCard.card.rarity);

    const result = await prisma.$transaction(async (tx) => {
      const updatedCard = await tx.userCard.update({
        where: { id: userCardId },
        data: { grade },
      });
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { stardustBalance: { decrement: GRADE_COST_STARDUST } },
      });
      return { updatedCard, updatedUser };
    });

    return successResponse({
      grade,
      cardName: userCard.card.name,
      rarity: userCard.card.rarity,
      newStardustBalance: result.updatedUser.stardustBalance,
    });
  } catch (error) {
    console.error('Grade error:', error);
    return errorResponse('Internal server error', 500);
  }
}
