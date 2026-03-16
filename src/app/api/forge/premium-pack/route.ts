import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { openPacks } from '@/lib/pack-engine';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const FORGE_COST = 200; // stardust

const forgeSchema = z.object({
  packId: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const parsed = forgeSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { packId } = parsed.data;

    const pack = await prisma.pack.findUnique({ where: { id: packId } });
    if (!pack) return errorResponse('Pack not found', 404);

    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser || freshUser.stardustBalance < FORGE_COST) {
      return errorResponse(`Not enough Stardust. Need ${FORGE_COST}, have ${freshUser?.stardustBalance || 0}`, 400);
    }

    const cards = await openPacks(packId, 1);

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { stardustBalance: { decrement: FORGE_COST } },
      });

      const userCardIds: string[] = [];
      for (const card of cards) {
        const uc = await tx.userCard.create({ data: { userId: user.id, cardId: card.id } });
        userCardIds.push(uc.id);
      }

      return { updatedUser, userCardIds };
    });

    return successResponse({
      cards,
      userCardIds: result.userCardIds,
      stardustSpent: FORGE_COST,
      newStardustBalance: result.updatedUser.stardustBalance,
      packName: pack.name,
    });
  } catch (error) {
    console.error('Forge premium pack error:', error);
    return errorResponse('Internal server error', 500);
  }
}
