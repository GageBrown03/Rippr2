import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { selectRandomCard, generateMultipleChoiceOptions } from '@/lib/minigame-engine';
import { SilhouetteChallenge } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

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

    // Get all cards from the database
    const allCards = await prisma.card.findMany({
      include: {
        pack: true,
      },
    });

    if (allCards.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No cards available for the game' },
        { status: 404 }
      );
    }

    // Select a random card (preferring rare cards for more interesting challenges)
    const selectedCard = selectRandomCard(allCards, true);

    // Generate multiple choice options
    const options = generateMultipleChoiceOptions(selectedCard, allCards, 4);

    // Create the challenge response
    const challenge: SilhouetteChallenge = {
      cardId: selectedCard.id,
      cardName: selectedCard.name, // We'll send this but client won't use it until reveal
      imageUrl: selectedCard.imageUrl,
      options: options,
      startTime: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('Error generating silhouette challenge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate challenge' },
      { status: 500 }
    );
  }
}