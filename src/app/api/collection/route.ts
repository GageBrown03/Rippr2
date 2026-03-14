import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { collectionQuerySchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const queryObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const parsed = collectionQuerySchema.safeParse(queryObj);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { rarity, type, setName, sortBy, page, limit } = parsed.data;

    // Build where clause
    const where: Prisma.UserCardWhereInput = {
      userId: user.id,
      card: {
        ...(rarity ? { rarity } : {}),
        ...(type ? { type } : {}),
        ...(setName ? { pack: { setName } } : {}),
      },
    };

    // Build orderBy
    let orderBy: Prisma.UserCardOrderByWithRelationInput;
    switch (sortBy) {
      case 'rarest':
        orderBy = { card: { weight: 'asc' } };
        break;
      case 'alphabetical':
        orderBy = { card: { name: 'asc' } };
        break;
      case 'newest':
      default:
        orderBy = { pulledAt: 'desc' };
        break;
    }

    const userCards = await prisma.userCard.findMany({
      where,
      include: {
        card: {
          include: {
            pack: { select: { setName: true } },
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse(userCards);
  } catch (error) {
    logger.error('Collection fetch error', { error });
    return errorResponse('Internal server error', 500);
  }
}
