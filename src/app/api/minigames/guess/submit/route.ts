import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCredits, checkAnswer, SILHOUETTE_CONFIG } from '@/lib/minigame-engine';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const submitSchema = z.object({
  cardId: z.string(),
  answer: z.string(),
  startTime: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = submitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error },
        { status: 400 }
      );
    }

    const { cardId, answer, startTime } = validation.data;

    // Get the correct card
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { name: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Check if answer is correct
    const isCorrect = checkAnswer(answer, card.name);

    if (!isCorrect) {
      return NextResponse.json({
        correct: false,
        correctAnswer: card.name,
        creditsEarned: 0,
        responseTime,
      });
    }

    // Check if response was within time limit
    if (responseTime > SILHOUETTE_CONFIG.timeLimit) {
      return NextResponse.json({
        correct: true,
        correctAnswer: card.name,
        creditsEarned: 0,
        responseTime,
        message: 'Time limit exceeded',
      });
    }

    // Calculate credits earned
    const creditsEarned = calculateCredits(responseTime);

    // Update user's coins
    await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: {
          increment: creditsEarned,
        },
      },
    });

    return NextResponse.json({
      correct: true,
      correctAnswer: card.name,
      creditsEarned,
      responseTime,
    });
  } catch (error) {
    console.error('Error submitting guess answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
