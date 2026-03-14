import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { selectRandomCard, generateMultipleChoiceOptions } from '@/lib/minigame-engine';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all cards from the database
    const allCards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        rarity: true,
        type: true,
      },
    });

    if (allCards.length === 0) {
      return NextResponse.json({ error: 'No cards available' }, { status: 404 });
    }

    // Select a random card for the challenge
    const correctCard = selectRandomCard(allCards, true);

    // Generate multiple choice options
    const options = generateMultipleChoiceOptions(correctCard, allCards, 4);

    return NextResponse.json({
      cardId: correctCard.id,
      imageUrl: correctCard.imageUrl,
      options,
      startTime: Date.now(),
    });
  } catch (error) {
    console.error('Error generating guess challenge:', error);
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 }
    );
  }
}
