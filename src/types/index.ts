export type User = {
  id: string;
  email: string;
  username: string;
  coins: number;
  lastDailyCoins: Date | null;
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export type Pack = {
  id: string;
  name: string;
  setName: string;
  description: string;
  imageUrl: string;
  cost: number;
  cardsPerPack: number;
  createdAt: Date;
};

export type Card = {
  id: string;
  packId: string;
  name: string;
  cardNumber: string;
  rarity: string;
  type: string;
  hp: number | null;
  imageUrl: string;
  flavorText: string | null;
  weight: number;
  createdAt: Date;
};

export type UserCard = {
  id: string;
  userId: string;
  cardId: string;
  pulledAt: Date;
  showcase: boolean;
};

export type PackOpening = {
  id: string;
  userId: string;
  packId: string;
  quantity: number;
  coinsSpent: number;
  openedAt: Date;
};

export type UserCardWithCard = UserCard & {
  card: Card;
};

export type CollectionFilters = {
  rarity?: string;
  type?: string;
  setName?: string;
  sortBy?: 'newest' | 'rarest' | 'alphabetical';
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PackOpenResult = {
  cards: Card[];
  newCoins: number;
};
