import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const packs = await prisma.pack.findMany({
      orderBy: { cost: 'asc' },
      include: {
        _count: {
          select: { cards: true },
        },
        cards: {
          where: { vaultOnly: false },
          orderBy: { weight: 'asc' },
          take: 1,
          select: { imageUrl: true, name: true, rarity: true },
        },
      },
    });

    // Attach featured card info to each pack
    const packsWithFeatured = packs.map((pack) => {
      const featured = pack.cards[0] || null;
      const { cards, ...packData } = pack;
      return { ...packData, featuredCard: featured };
    });

    return successResponse(packsWithFeatured);
  } catch (error) {
    logger.error('Failed to fetch packs', { error });
    return errorResponse('Internal server error', 500);
  }
}
