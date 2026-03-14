'use client';

import type { UserCardWithCard } from '@/types';

export type CollectionGridProps = {
  userCards: UserCardWithCard[];
  onToggleShowcase: (userCardId: string) => void;
};

function getRarityClass(rarity: string): string {
  switch (rarity) {
    case 'Common': return 'card-common';
    case 'Uncommon': return 'card-uncommon';
    case 'Rare': return 'card-rare';
    case 'Holo Rare': return 'card-holo-rare';
    case 'Ultra Rare': return 'card-ultra-rare';
    default: return 'card-common';
  }
}

function getRarityEmoji(rarity: string): string {
  switch (rarity) {
    case 'Common': return '⚪';
    case 'Uncommon': return '🟢';
    case 'Rare': return '🔵';
    case 'Holo Rare': return '🟣';
    case 'Ultra Rare': return '⭐';
    default: return '⚪';
  }
}

export default function CollectionGrid({ userCards, onToggleShowcase }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {userCards.map((userCard) => (
        <div
          key={userCard.id}
          className={`rounded-xl p-3 relative ${getRarityClass(userCard.card.rarity)} ${
            userCard.showcase ? 'ring-4 ring-pokeyellow' : ''
          }`}
        >
          {userCard.showcase && (
            <div className="absolute -top-2 -right-2 bg-pokeyellow text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              ★
            </div>
          )}

          <div className="text-center">
            <div className="text-2xl mb-1">{getRarityEmoji(userCard.card.rarity)}</div>
            <h4 className="font-bold text-sm truncate">{userCard.card.name}</h4>
            <p className="text-xs text-gray-600">{userCard.card.type}</p>
            <p className="text-xs font-semibold mt-1">{userCard.card.rarity}</p>
            {userCard.card.hp && (
              <p className="text-xs text-gray-500">HP {userCard.card.hp}</p>
            )}
            {userCard.card.flavorText && (
              <p className="text-xs italic text-gray-500 mt-1 line-clamp-2">
                {userCard.card.flavorText}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(userCard.pulledAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => onToggleShowcase(userCard.id)}
            className={`w-full mt-2 text-xs py-1 rounded font-semibold transition-colors ${
              userCard.showcase
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-pokeyellow text-black hover:bg-yellow-400'
            }`}
          >
            {userCard.showcase ? 'Remove Showcase' : 'Showcase'}
          </button>
        </div>
      ))}
    </div>
  );
}
