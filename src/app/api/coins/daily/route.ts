import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

const DAILY_COINS = 100;
const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    // Fetch fresh user data
    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!freshUser) {
      return errorResponse('User not found', 404);
    }

    // Check cooldown
    if (freshUser.lastDailyCoins) {
      const timeSinceLast = Date.now() - freshUser.lastDailyCoins.getTime();
      if (timeSinceLast < DAILY_COOLDOWN_MS) {
        const hoursRemaining = Math.ceil((DAILY_COOLDOWN_MS - timeSinceLast) / (60 * 60 * 1000));
        return errorResponse(`Daily coins already claimed. Try again in ${hoursRemaining} hours.`, 400);
      }
    }

    // Award coins
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: DAILY_COINS },
        lastDailyCoins: new Date(),
      },
    });

    logger.info(`User ${freshUser.username} claimed ${DAILY_COINS} daily coins`);

    return successResponse({
      coinsAwarded: DAILY_COINS,
      newCoins: updatedUser.coins,
    });
  } catch (error) {
    logger.error('Daily coins error', { error });
    return errorResponse('Internal server error', 500);
  }
}
