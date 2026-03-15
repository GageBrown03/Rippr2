import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';
import { z } from 'zod';

const SELL_VALUES: Record<string, number> = {
  Common: 5,
  Uncommon: 15,
  Rare: 50,
  'Holo Rare': 150,
  'Ultra Rare': 500,
};

const sellSchema = z.object({
  rarity: z.string().min(1, 'Rarity is required'),
  // Optional: sell specific card IDs instead of all of a rarity
  userCardIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const parsed = sellSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { rarity, userCardIds } = parsed.data;

    const sellValue = SELL_VALUES[rarity];
    if (sellValue === undefined) {
      return errorResponse('Invalid rarity', 400);
    }

    // Find cards to sell (exclude showcased cards)
    const where: any = {
      userId: user.id,
      showcase: false,
      card: { rarity },
    };

    // If specific IDs provided, filter to those
    if (userCardIds && userCardIds.length > 0) {
      where.id = { in: userCardIds };
    }

    const cardsToSell = await prisma.userCard.findMany({
      where,
      select: { id: true },
    });

    if (cardsToSell.length === 0) {
      return errorResponse('No cards to sell (showcased cards are protected)', 400);
    }

    const totalCoins = cardsToSell.length * sellValue;

    // Delete cards and add coins in a transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.userCard.deleteMany({
        where: {
          id: { in: cardsToSell.map((c) => c.id) },
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { coins: { increment: totalCoins } },
      });

      return updatedUser;
    });

    logger.info(`User ${user.username} sold ${cardsToSell.length} ${rarity} cards for ${totalCoins} coins`);

    return successResponse({
      cardsSold: cardsToSell.length,
      coinsEarned: totalCoins,
      pricePerCard: sellValue,
      newCoins: result.coins,
    });
  } catch (error) {
    logger.error('Card sell error', { error });
    return errorResponse('Internal server error', 500);
  }
}
