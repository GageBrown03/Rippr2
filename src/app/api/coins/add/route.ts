import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

const ADD_COINS = 5000;
const ADD_STARDUST = 500;
const ADD_DELTA = 3;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: ADD_COINS },
        stardustBalance: { increment: ADD_STARDUST },
        deltaEnergy: { increment: ADD_DELTA },
      },
    });

    logger.info(`[TEST] User ${user.username} added test balance`);

    return successResponse({
      coinsAdded: ADD_COINS,
      stardustAdded: ADD_STARDUST,
      deltaEnergyAdded: ADD_DELTA,
      newCoins: updatedUser.coins,
      newStardustBalance: updatedUser.stardustBalance,
      newDeltaEnergy: updatedUser.deltaEnergy,
    });
  } catch (error) {
    logger.error('Add balance error', { error });
    return errorResponse('Internal server error', 500);
  }
}
