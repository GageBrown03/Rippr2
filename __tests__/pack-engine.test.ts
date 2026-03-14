import { selectCardsByWeight } from '@/lib/pack-engine';
import type { Card } from '@/types';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    pack: {
      findUnique: jest.fn(),
    },
  },
}));

const mockCards: Card[] = [
  {
    id: '1', packId: 'p1', name: 'Pikachu', cardNumber: 'BS-001',
    rarity: 'Common', type: 'Electric', hp: 60, imageUrl: '', flavorText: null,
    weight: 1.0, createdAt: new Date(),
  },
  {
    id: '2', packId: 'p1', name: 'Raichu', cardNumber: 'BS-002',
    rarity: 'Uncommon', type: 'Electric', hp: 90, imageUrl: '', flavorText: null,
    weight: 0.4, createdAt: new Date(),
  },
  {
    id: '3', packId: 'p1', name: 'Charizard', cardNumber: 'BS-003',
    rarity: 'Ultra Rare', type: 'Fire', hp: 180, imageUrl: '', flavorText: null,
    weight: 0.01, createdAt: new Date(),
  },
];

describe('Pack Engine', () => {
  describe('selectCardsByWeight', () => {
    it('should return the correct number of cards', () => {
      const result = selectCardsByWeight(mockCards, 11);
      expect(result).toHaveLength(11);
    });

    it('should return empty array for empty input', () => {
      const result = selectCardsByWeight([], 5);
      expect(result).toHaveLength(0);
    });

    it('should only return cards from the input array', () => {
      const result = selectCardsByWeight(mockCards, 100);
      const validIds = new Set(mockCards.map((c) => c.id));
      result.forEach((card) => {
        expect(validIds.has(card.id)).toBe(true);
      });
    });

    it('should favor higher-weight cards', () => {
      // Run many selections and check distribution
      const results = selectCardsByWeight(mockCards, 10000);
      const counts: Record<string, number> = {};
      results.forEach((card) => {
        counts[card.rarity] = (counts[card.rarity] || 0) + 1;
      });

      // Common should appear most often
      expect(counts['Common']).toBeGreaterThan(counts['Uncommon'] || 0);
      expect(counts['Uncommon'] || 0).toBeGreaterThan(counts['Ultra Rare'] || 0);
    });
  });

  describe('openPacks', () => {
    it('should throw for non-existent pack', async () => {
      const prisma = require('@/lib/prisma').default;
      prisma.pack.findUnique.mockResolvedValue(null);

      const { openPacks } = require('@/lib/pack-engine');
      await expect(openPacks('nonexistent', 1)).rejects.toThrow('Pack not found');
    });
  });
});
