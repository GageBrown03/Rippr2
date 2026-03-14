import { prisma } from '@/lib/prisma';
import type { Card } from '@/types';
import logger from '@/lib/logger';

export function selectCardsByWeight(cards: Card[], count: number): Card[] {
  if (cards.length === 0) return [];

  const selected: Card[] = [];
  const totalWeight = cards.reduce((sum, card) => sum + card.weight, 0);

  for (let i = 0; i < count; i++) {
    let random = Math.random() * totalWeight;
    let chosen: Card = cards[0];

    for (const card of cards) {
      random -= card.weight;
      if (random <= 0) {
        chosen = card;
        break;
      }
    }

    selected.push(chosen);
  }

  return selected;
}

export async function openPacks(packId: string, quantity: number): Promise<Card[]> {
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { cards: true },
  });

  if (!pack) {
    throw new Error('Pack not found');
  }

  const totalCards = pack.cardsPerPack * quantity;
  const cards = pack.cards as Card[];

  logger.info(`Opening ${quantity} packs of ${pack.name}, selecting ${totalCards} cards`);

  const selectedCards = selectCardsByWeight(cards, totalCards);

  return selectedCards;
}
