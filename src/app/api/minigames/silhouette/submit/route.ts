import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { checkAnswer, calculateCredits, SILHOUETTE_CONFIG } from '@/lib/minigame-engine';
import { SilhouetteResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify session
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cardId, answer, responseTime } = body;

    if (!cardId || !answer || typeof responseTime !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid submission data' },
        { status: 400 }
      );
    }

    // Validate response time (prevent cheating)
    if (responseTime < 0 || responseTime > SILHOUETTE_CONFIG.timeLimit + 1000) {
      return NextResponse.json(
        { success: false, error: 'Invalid response time' },
        { status: 400 }
      );
    }

    // Get the card
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    // Check if answer is correct
    const isCorrect = checkAnswer(answer, card.name);

    // Calculate credits earned (only if correct)
    const creditsEarned = isCorrect ? calculateCredits(responseTime) : 0;

    // Update user coins if they earned credits
    let newCoins = session.user.coins;
    if (creditsEarned > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: {
          coins: {
            increment: creditsEarned,
          },
        },
      });
      newCoins = updatedUser.coins;
    }

    // Record the attempt
    await prisma.minigameAttempt.create({
      data: {
        userId: session.userId,
        gameType: 'silhouette',
        cardId: card.id,
        cardName: card.name,
        responseTime: responseTime,
        correct: isCorrect,
        creditsEarned: creditsEarned,
      },
    });

    const result: SilhouetteResult = {
      correct: isCorrect,
      correctAnswer: card.name,
      creditsEarned: creditsEarned,
      responseTime: responseTime,
      newCoins: newCoins,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error submitting silhouette answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}