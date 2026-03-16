import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const VALID_DELTA_TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Dark', 'Dragon', 'Steel', 'Fairy'];

const mutateSchema = z.object({
  userCardId: z.string().min(1),
  targetType: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = mutateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { userCardId, targetType } = parsed.data;

    if (!VALID_DELTA_TYPES.includes(targetType)) {
      return errorResponse(`Invalid delta type. Valid: ${VALID_DELTA_TYPES.join(', ')}`, 400);
    }

    const userCard = await prisma.userCard.findFirst({
      where: { id: userCardId, userId: user.id },
      include: { card: true },
    });

    if (!userCard) return errorResponse('Card not found in your collection', 404);
    if (userCard.deltaType) return errorResponse('This card is already a Delta Species', 400);

    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser || freshUser.deltaEnergy < 1) {
      return errorResponse('No Delta Energy available. Earn it through set completion!', 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedCard = await tx.userCard.update({
        where: { id: userCardId },
        data: { deltaType: targetType },
      });
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { deltaEnergy: { decrement: 1 } },
      });
      return { updatedCard, updatedUser };
    });

    return successResponse({
      cardName: userCard.card.name,
      originalType: userCard.card.type,
      newDeltaType: targetType,
      deltaEnergyRemaining: result.updatedUser.deltaEnergy,
    });
  } catch (error) {
    console.error('Mutate error:', error);
    return errorResponse('Internal server error', 500);
  }
}
