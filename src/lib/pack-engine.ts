import { prisma } from '@/lib/prisma';
import type { Card } from '@/types';
import logger from '@/lib/logger';

const HOLO_BLEED_BASE_CHANCE = 0.005; // 0.5%
const HOLO_ELIGIBLE_RARITIES = ['Holo Rare', 'Ultra Rare'];

export function selectCardsByWeight(cards: Card[], count: number, luckModifier: number = 0): Card[] {
  if (cards.length === 0) return [];

  // Apply luck modifier: boost rare+ card weights
  const boostedCards = cards.map((card) => {
    const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);
    const boost = isRarePlus ? 1 + luckModifier : 1;
    return { ...card, effectiveWeight: card.weight * boost };
  });

  const totalWeight = boostedCards.reduce((sum, card) => sum + card.effectiveWeight, 0);
  const selected: Card[] = [];

  for (let i = 0; i < count; i++) {
    let random = Math.random() * totalWeight;
    let chosen = boostedCards[0];

    for (const card of boostedCards) {
      random -= card.effectiveWeight;
      if (random <= 0) { chosen = card; break; }
    }

    selected.push(chosen);
  }

  return selected;
}

export function rollHoloBleed(rarity: string, luckModifier: number = 0): boolean {
  if (!HOLO_ELIGIBLE_RARITIES.includes(rarity)) return false;
  const chance = HOLO_BLEED_BASE_CHANCE + (luckModifier * 0.002); // luck slightly boosts bleed chance
  return Math.random() < chance;
}

export async function openPacks(packId: string, quantity: number, luckModifier: number = 0): Promise<Card[]> {
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { cards: true },
  });

  if (!pack) throw new Error('Pack not found');

  const totalCards = pack.cardsPerPack * quantity;
  const cards = (pack.cards as Card[]).filter((c) => !c.vaultOnly && c.weight > 0);

  logger.info(`Opening ${quantity} packs of ${pack.name}, selecting ${totalCards} cards (luck: ${luckModifier})`);

  return selectCardsByWeight(cards, totalCards, luckModifier);
}
