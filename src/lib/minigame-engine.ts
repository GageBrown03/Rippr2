import { Card } from '@/types';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface MinigameConfig {
  timeLimit: number;
  rewardTiers: {
    fast: { maxTime: number; credits: number };
    medium: { maxTime: number; credits: number };
    slow: { maxTime: number; credits: number };
  };
}

export const SILHOUETTE_CONFIG: MinigameConfig = {
  timeLimit: 10000, // 10 seconds in milliseconds
  rewardTiers: {
    fast: { maxTime: 3000, credits: 100 },
    medium: { maxTime: 7000, credits: 50 },
    slow: { maxTime: 10000, credits: 10 },
  },
};

export function calculateCredits(responseTime: number, config: MinigameConfig = SILHOUETTE_CONFIG): number {
  if (responseTime <= config.rewardTiers.fast.maxTime) {
    return config.rewardTiers.fast.credits;
  } else if (responseTime <= config.rewardTiers.medium.maxTime) {
    return config.rewardTiers.medium.credits;
  } else if (responseTime <= config.rewardTiers.slow.maxTime) {
    return config.rewardTiers.slow.credits;
  }
  return 0;
}

export function generateMultipleChoiceOptions(correctCard: Card, allCards: Card[], count: number = 4): string[] {
  const options = new Set<string>([correctCard.name]);
  
  // Filter out cards with the same name as the correct answer
  const otherCards = allCards.filter(card => card.name !== correctCard.name);
  
  // Shuffle and pick random cards
  const shuffled = [...otherCards].sort(() => Math.random() - 0.5);
  
  for (const card of shuffled) {
    if (options.size >= count) break;
    options.add(card.name);
  }
  
  // If we don't have enough unique cards, we'll just return what we have
  const optionsArray = Array.from(options);
  
  // Shuffle the final options
  return optionsArray.sort(() => Math.random() - 0.5);
}

export function selectRandomCard(cards: Card[], preferRare: boolean = true): Card {
  if (cards.length === 0) {
    throw new Error('No cards available for selection');
  }
  
  if (preferRare) {
    // Prefer illustration rare or rare cards for more interesting challenges
    const rareCards = cards.filter(card => 
      card.rarity.toLowerCase().includes('rare') || 
      card.rarity.toLowerCase().includes('illustration')
    );
    
    if (rareCards.length > 0) {
      return rareCards[Math.floor(Math.random() * rareCards.length)];
    }
  }
  
  return cards[Math.floor(Math.random() * cards.length)];
}

export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}