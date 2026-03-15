import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

const ADD_AMOUNT = 5000;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { coins: { increment: ADD_AMOUNT } },
    });

    logger.info(`[TEST] User ${user.username} added ${ADD_AMOUNT} test coins`);

    return successResponse({
      coinsAdded: ADD_AMOUNT,
      newCoins: updatedUser.coins,
    });
  } catch (error) {
    logger.error('Add balance error', { error });
    return errorResponse('Internal server error', 500);
  }
}
