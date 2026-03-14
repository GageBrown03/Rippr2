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
      },
    });

    return successResponse(packs);
  } catch (error) {
    logger.error('Failed to fetch packs', { error });
    return errorResponse('Internal server error', 500);
  }
}
