'use client';

import { useState } from 'react';
import type { Card } from '@/types';

export type CardRevealProps = {
  cards: Card[];
  onClose: () => void;
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

export default function CardReveal({ cards, onClose }: CardRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function revealCard(index: number) {
    setRevealed((prev) => new Set(prev).add(index));
  }

  function revealAll() {
    setRevealed(new Set(cards.map((_, i) => i)));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Pack Results ({cards.length} cards)
          </h2>
          <div className="flex gap-3">
            <button onClick={revealAll} className="btn-secondary text-sm">
              Reveal All
            </button>
            <button onClick={onClose} className="btn-primary text-sm">
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              onClick={() => revealCard(index)}
              className={`cursor-pointer rounded-xl p-3 transition-all duration-300 ${
                revealed.has(index)
                  ? getRarityClass(card.rarity)
                  : 'bg-pokeblue'
              }`}
            >
              {revealed.has(index) ? (
                <div className="text-center animate-card-flip">
                  <div className="text-3xl mb-2">{getRarityEmoji(card.rarity)}</div>
                  <h4 className="font-bold text-sm truncate">{card.name}</h4>
                  <p className="text-xs text-gray-600">{card.type}</p>
                  <p className="text-xs font-semibold mt-1">{card.rarity}</p>
                  {card.hp && (
                    <p className="text-xs text-gray-500">HP {card.hp}</p>
                  )}
                  {card.flavorText && (
                    <p className="text-xs italic text-gray-500 mt-1 line-clamp-2">
                      {card.flavorText}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl">❓</div>
                  <p className="text-white text-xs mt-2">Click to reveal</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
