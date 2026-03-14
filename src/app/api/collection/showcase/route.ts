import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { showcaseSchema } from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/response';
import logger from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const parsed = showcaseSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { userCardId, showcase } = parsed.data;

    // Verify ownership
    const userCard = await prisma.userCard.findFirst({
      where: { id: userCardId, userId: user.id },
    });

    if (!userCard) {
      return errorResponse('Card not found in your collection', 404);
    }

    // Check showcase limit (max 12)
    if (showcase) {
      const currentShowcaseCount = await prisma.userCard.count({
        where: { userId: user.id, showcase: true },
      });

      if (currentShowcaseCount >= 12) {
        return errorResponse('Maximum 12 showcase cards allowed. Remove one first.', 400);
      }
    }

    const updated = await prisma.userCard.update({
      where: { id: userCardId },
      data: { showcase },
      include: { card: true },
    });

    logger.info(`User ${user.username} toggled showcase for card ${updated.card.name}`);

    return successResponse(updated);
  } catch (error) {
    logger.error('Showcase toggle error', { error });
    return errorResponse('Internal server error', 500);
  }
}
