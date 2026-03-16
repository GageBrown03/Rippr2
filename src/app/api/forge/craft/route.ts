import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const CRAFT_COSTS: Record<string, number> = {
  Common: 10,
  Uncommon: 25,
  Rare: 60,
  'Holo Rare': 150,
  'Ultra Rare': 400,
};

const craftSchema = z.object({
  cardId: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = craftSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { cardId } = parsed.data;

    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) return errorResponse('Card not found', 404);
    if (card.vaultOnly) return errorResponse('This card cannot be crafted — it is vault-exclusive', 400);

    const cost = CRAFT_COSTS[card.rarity] || 10;

    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser || freshUser.stardustBalance < cost) {
      return errorResponse(`Not enough Stardust. Need ${cost}, have ${freshUser?.stardustBalance || 0}`, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { stardustBalance: { decrement: cost } },
      });
      const userCard = await tx.userCard.create({
        data: { userId: user.id, cardId: card.id },
      });
      return { updatedUser, userCard };
    });

    return successResponse({
      userCardId: result.userCard.id,
      cardName: card.name,
      stardustSpent: cost,
      newStardustBalance: result.updatedUser.stardustBalance,
    });
  } catch (error) {
    console.error('Craft error:', error);
    return errorResponse('Internal server error', 500);
  }
}
