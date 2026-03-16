export type User = {
  id: string;
  email: string;
  username: string;
  coins: number;
  stardustBalance: number;
  deltaEnergy: number;
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
  vaultOnly: boolean;
  createdAt: Date;
};

export type UserCard = {
  id: string;
  userId: string;
  cardId: string;
  pulledAt: Date;
  showcase: boolean;
  grade: number | null;
  deltaType: string | null;
};

export type PackOpening = {
  id: string;
  userId: string;
  packId: string;
  quantity: number;
  coinsSpent: number;
  openedAt: Date;
};

export type MinigameAttempt = {
  id: string;
  userId: string;
  gameType: string;
  cardId: string | null;
  cardName: string;
  responseTime: number;
  correct: boolean;
  creditsEarned: number;
  createdAt: Date;
};

export type CompletedSet = {
  id: string;
  userId: string;
  setName: string;
  completedAt: Date;
};

export type UserCardWithCard = UserCard & {
  card: Card & { pack?: { setName: string } };
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

export type SilhouetteChallenge = {
  cardId: string;
  cardName: string;
  imageUrl: string;
  cardImageUrl?: string;
  options: string[];
  startTime: number;
};

export type SilhouetteSubmission = {
  cardId: string;
  answer: string;
  responseTime: number;
};

export type SilhouetteResult = {
  correct: boolean;
  correctAnswer: string;
  creditsEarned: number;
  responseTime: number;
  newCoins: number;
};
