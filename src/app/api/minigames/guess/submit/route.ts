import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCredits, GUESS_CONFIG } from '@/lib/minigame-engine';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const submitSchema = z.object({
  cardId: z.string(),
  answer: z.string(),
  correctName: z.string(),
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
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { cardId, answer, correctName, startTime } = validation.data;

    // Get the correct card for recording
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { name: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const responseTime = Date.now() - startTime;
    const isCorrect = answer.toLowerCase().trim() === correctName.toLowerCase().trim();

    if (!isCorrect) {
      // Record attempt
      await prisma.minigameAttempt.create({
        data: {
          userId: user.id,
          gameType: 'guess',
          cardId,
          cardName: card.name,
          responseTime,
          correct: false,
          creditsEarned: 0,
        },
      });

      return NextResponse.json({
        correct: false,
        correctAnswer: correctName,
        creditsEarned: 0,
        responseTime,
      });
    }

    // Check time limit
    if (responseTime > GUESS_CONFIG.timeLimit) {
      await prisma.minigameAttempt.create({
        data: {
          userId: user.id,
          gameType: 'guess',
          cardId,
          cardName: card.name,
          responseTime,
          correct: true,
          creditsEarned: 0,
        },
      });

      return NextResponse.json({
        correct: true,
        correctAnswer: correctName,
        creditsEarned: 0,
        responseTime,
        message: 'Time limit exceeded',
      });
    }

    const creditsEarned = calculateCredits(responseTime, GUESS_CONFIG);

    // Update coins and record attempt
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { coins: { increment: creditsEarned } },
    });

    await prisma.minigameAttempt.create({
      data: {
        userId: user.id,
        gameType: 'guess',
        cardId,
        cardName: card.name,
        responseTime,
        correct: true,
        creditsEarned,
      },
    });

    return NextResponse.json({
      correct: true,
      correctAnswer: correctName,
      creditsEarned,
      responseTime,
      newCoins: updatedUser.coins,
    });
  } catch (error) {
    console.error('Error submitting guess answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
