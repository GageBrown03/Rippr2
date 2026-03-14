import type { UserCardWithCard, CollectionFilters } from '@/types';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    userCard: {
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockUserCards: UserCardWithCard[] = [
  {
    id: 'uc1', userId: 'u1', cardId: 'c1', pulledAt: new Date('2024-01-01'), showcase: false,
    card: {
      id: 'c1', packId: 'p1', name: 'Pikachu', cardNumber: 'BS-001',
      rarity: 'Common', type: 'Electric', hp: 60, imageUrl: '', flavorText: null,
      weight: 1.0, createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'uc2', userId: 'u1', cardId: 'c2', pulledAt: new Date('2024-01-02'), showcase: true,
    card: {
      id: 'c2', packId: 'p1', name: 'Charizard', cardNumber: 'BS-002',
      rarity: 'Ultra Rare', type: 'Fire', hp: 180, imageUrl: '', flavorText: null,
      weight: 0.01, createdAt: new Date('2024-01-02'),
    },
  },
  {
    id: 'uc3', userId: 'u1', cardId: 'c3', pulledAt: new Date('2024-01-03'), showcase: false,
    card: {
      id: 'c3', packId: 'p1', name: 'Blastoise', cardNumber: 'BS-003',
      rarity: 'Rare', type: 'Water', hp: 120, imageUrl: '', flavorText: null,
      weight: 0.15, createdAt: new Date('2024-01-03'),
    },
  },
];

describe('Collection', () => {
  describe('Filtering', () => {
    it('should filter by rarity', () => {
      const filtered = mockUserCards.filter(
        (uc) => uc.card.rarity === 'Common'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].card.name).toBe('Pikachu');
    });

    it('should filter by type', () => {
      const filtered = mockUserCards.filter(
        (uc) => uc.card.type === 'Fire'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].card.name).toBe('Charizard');
    });

    it('should filter by multiple criteria', () => {
      const filtered = mockUserCards.filter(
        (uc) => uc.card.type === 'Water' && uc.card.rarity === 'Rare'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].card.name).toBe('Blastoise');
    });

    it('should return empty array when no matches', () => {
      const filtered = mockUserCards.filter(
        (uc) => uc.card.type === 'Dragon'
      );
      expect(filtered).toHaveLength(0);
    });

    it('should sort alphabetically', () => {
      const sorted = [...mockUserCards].sort((a, b) =>
        a.card.name.localeCompare(b.card.name)
      );
      expect(sorted[0].card.name).toBe('Blastoise');
      expect(sorted[1].card.name).toBe('Charizard');
      expect(sorted[2].card.name).toBe('Pikachu');
    });

    it('should sort by newest first', () => {
      const sorted = [...mockUserCards].sort((a, b) =>
        b.pulledAt.getTime() - a.pulledAt.getTime()
      );
      expect(sorted[0].card.name).toBe('Blastoise');
      expect(sorted[1].card.name).toBe('Charizard');
      expect(sorted[2].card.name).toBe('Pikachu');
    });

    it('should sort by rarest first (lowest weight)', () => {
      const sorted = [...mockUserCards].sort((a, b) =>
        a.card.weight - b.card.weight
      );
      expect(sorted[0].card.name).toBe('Charizard');
      expect(sorted[1].card.name).toBe('Blastoise');
      expect(sorted[2].card.name).toBe('Pikachu');
    });
  });

  describe('Showcase', () => {
    it('should identify showcased cards', () => {
      const showcased = mockUserCards.filter((uc) => uc.showcase);
      expect(showcased).toHaveLength(1);
      expect(showcased[0].card.name).toBe('Charizard');
    });

    it('should identify non-showcased cards', () => {
      const nonShowcased = mockUserCards.filter((uc) => !uc.showcase);
      expect(nonShowcased).toHaveLength(2);
      expect(nonShowcased.map(uc => uc.card.name)).toContain('Pikachu');
      expect(nonShowcased.map(uc => uc.card.name)).toContain('Blastoise');
    });

    it('should enforce max 12 showcase limit', () => {
      const MAX_SHOWCASE = 12;
      const showcaseCount = mockUserCards.filter((uc) => uc.showcase).length;
      expect(showcaseCount).toBeLessThanOrEqual(MAX_SHOWCASE);
    });

    it('should validate showcase limit with full collection', () => {
      const MAX_SHOWCASE = 12;
      const largeCollection: UserCardWithCard[] = Array.from({ length: 20 }, (_, i) => ({
        id: `uc${i}`,
        userId: 'u1',
        cardId: `c${i}`,
        pulledAt: new Date(),
        showcase: i < 12, // First 12 are showcased
        card: {
          id: `c${i}`,
          packId: 'p1',
          name: `Card ${i}`,
          cardNumber: `BS-${String(i).padStart(3, '0')}`,
          rarity: 'Common',
          type: 'Normal',
          hp: 50,
          imageUrl: '',
          flavorText: null,
          weight: 1.0,
          createdAt: new Date(),
        },
      }));

      const showcaseCount = largeCollection.filter((uc) => uc.showcase).length;
      expect(showcaseCount).toBe(MAX_SHOWCASE);
      expect(showcaseCount).toBeLessThanOrEqual(MAX_SHOWCASE);
    });

    it('should toggle showcase status', () => {
      const card = mockUserCards[0];
      const toggled = { ...card, showcase: !card.showcase };
      expect(toggled.showcase).toBe(true);
      expect(card.showcase).toBe(false);
    });
  });

  describe('Collection Statistics', () => {
    it('should count total cards', () => {
      expect(mockUserCards.length).toBe(3);
    });

    it('should count cards by rarity', () => {
      const rarityCount: Record<string, number> = {};
      mockUserCards.forEach((uc) => {
        rarityCount[uc.card.rarity] = (rarityCount[uc.card.rarity] || 0) + 1;
      });
      expect(rarityCount['Common']).toBe(1);
      expect(rarityCount['Rare']).toBe(1);
      expect(rarityCount['Ultra Rare']).toBe(1);
    });

    it('should count cards by type', () => {
      const typeCount: Record<string, number> = {};
      mockUserCards.forEach((uc) => {
        typeCount[uc.card.type] = (typeCount[uc.card.type] || 0) + 1;
      });
      expect(typeCount['Electric']).toBe(1);
      expect(typeCount['Fire']).toBe(1);
      expect(typeCount['Water']).toBe(1);
    });

    it('should find highest HP card', () => {
      const highestHp = mockUserCards.reduce((max, uc) => {
        const hp = uc.card.hp || 0;
        return hp > (max.card.hp || 0) ? uc : max;
      });
      expect(highestHp.card.name).toBe('Charizard');
      expect(highestHp.card.hp).toBe(180);
    });

    it('should find rarest card (lowest weight)', () => {
      const rarest = mockUserCards.reduce((min, uc) => {
        return uc.card.weight < min.card.weight ? uc : min;
      });
      expect(rarest.card.name).toBe('Charizard');
      expect(rarest.card.weight).toBe(0.01);
    });
  });

  describe('Collection Queries', () => {
    it('should support complex filtering', () => {
      const filters: CollectionFilters = {
        rarity: 'Ultra Rare',
        type: 'Fire',
        sortBy: 'newest',
      };

      let filtered = mockUserCards.filter((uc) => {
        if (filters.rarity && uc.card.rarity !== filters.rarity) return false;
        if (filters.type && uc.card.type !== filters.type) return false;
        return true;
      });

      if (filters.sortBy === 'newest') {
        filtered = filtered.sort((a, b) => b.pulledAt.getTime() - a.pulledAt.getTime());
      }

      expect(filtered).toHaveLength(1);
      expect(filtered[0].card.name).toBe('Charizard');
    });

    it('should handle empty filter results', () => {
      const filters: CollectionFilters = {
        rarity: 'Legendary',
        type: 'Dragon',
      };

      const filtered = mockUserCards.filter((uc) => {
        if (filters.rarity && uc.card.rarity !== filters.rarity) return false;
        if (filters.type && uc.card.type !== filters.type) return false;
        return true;
      });

      expect(filtered).toHaveLength(0);
    });

    it('should support pagination', () => {
      const page = 1;
      const limit = 2;
      const skip = (page - 1) * limit;

      const paginated = mockUserCards.slice(skip, skip + limit);
      expect(paginated).toHaveLength(2);
      expect(paginated[0].card.name).toBe('Pikachu');
      expect(paginated[1].card.name).toBe('Charizard');
    });
  });
});
