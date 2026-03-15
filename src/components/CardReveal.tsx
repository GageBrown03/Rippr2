'use client';

import { useState } from 'react';
import type { Card } from '@/types';
import Image from 'next/image';

export type CardRevealProps = {
  cards: Card[];
  onClose: () => void;
  onSellUpdate?: (newCoins: number) => void;
};

const RARITY_STYLES: Record<string, { border: string; glow: string; label: string }> = {
  Common:       { border: '#6B7280', glow: 'rgba(107,114,128,0.2)', label: '#9CA3AF' },
  Uncommon:     { border: '#22C55E', glow: 'rgba(34,197,94,0.25)',  label: '#4ADE80' },
  Rare:         { border: '#3B82F6', glow: 'rgba(59,130,246,0.3)',  label: '#60A5FA' },
  'Holo Rare':  { border: '#A855F7', glow: 'rgba(168,85,247,0.35)', label: '#C084FC' },
  'Ultra Rare': { border: '#EAB308', glow: 'rgba(234,179,8,0.4)',  label: '#FACC15' },
};

const SELL_VALUES: Record<string, number> = {
  Common: 5,
  Uncommon: 15,
  Rare: 50,
  'Holo Rare': 150,
  'Ultra Rare': 500,
};

function getStyle(rarity: string) {
  return RARITY_STYLES[rarity] || RARITY_STYLES['Common'];
}

export default function CardReveal({ cards, onClose, onSellUpdate }: CardRevealProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set(cards.map((_, i) => i)));
  const [selling, setSelling] = useState(false);
  const [sellMessage, setSellMessage] = useState('');

  function revealAll() {
    setRevealed(new Set(cards.map((_, i) => i)));
  }

  // Count cards by rarity
  const rarityCounts: Record<string, number> = {};
  cards.forEach((card) => {
    rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + 1;
  });

  async function handleSellRarity(rarity: string) {
    if (selling) return;
    setSelling(true);
    setSellMessage('');

    try {
      const res = await fetch('/api/collection/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rarity }),
      });
      const data = await res.json();
      if (data.success) {
        setSellMessage(`Sold ${data.data.cardsSold} ${rarity} cards for 🪙 ${data.data.coinsEarned.toLocaleString()}`);
        if (onSellUpdate) onSellUpdate(data.data.newCoins);
      } else {
        setSellMessage(data.error || 'Failed to sell');
      }
    } catch (err) {
      console.error('Sell error:', err);
      setSellMessage('Failed to sell cards');
    } finally {
      setSelling(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-white">
            Pack Results ({cards.length} cards)
          </h2>
          <div className="flex gap-3">
            <button
              onClick={revealAll}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Reveal All
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #E3350D, #c62d0a)', color: '#fff' }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Quick Sell Bar */}
        <div className="rounded-xl p-3 mb-6 flex flex-wrap items-center gap-2" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-semibold mr-1" style={{ color: '#64748b' }}>Quick Sell:</span>
          {['Common', 'Uncommon', 'Rare'].map((rarity) => {
            const count = rarityCounts[rarity] || 0;
            const value = SELL_VALUES[rarity] || 0;
            const rs = getStyle(rarity);
            return (
              <button
                key={rarity}
                onClick={() => handleSellRarity(rarity)}
                disabled={selling || count === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: `${rs.border}20`,
                  color: rs.label,
                  border: `1px solid ${rs.border}40`,
                }}
              >
                Sell All {rarity} ({count}) · 🪙 {(count * value).toLocaleString()}
              </button>
            );
          })}
          {sellMessage && (
            <span className="text-xs font-medium ml-auto" style={{ color: '#4ADE80' }}>{sellMessage}</span>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => {
            const rs = getStyle(card.rarity);
            const isRevealed = revealed.has(index);

            return (
              <div
                key={`${card.id}-${index}`}
                onClick={() => setRevealed((prev) => new Set(prev).add(index))}
                className="cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-[1.03]"
                style={
                  isRevealed
                    ? {
                        background: '#1a1f2e',
                        border: `2px solid ${rs.border}`,
                        boxShadow: `0 0 16px ${rs.glow}, 0 4px 16px rgba(0,0,0,0.4)`,
                      }
                    : {
                        background: '#0f172a',
                        border: '2px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      }
                }
              >
                {isRevealed ? (
                  <div className="text-center">
                    {card.imageUrl && (
                      <div className="relative w-full aspect-[3/4] mb-2 rounded-lg overflow-hidden">
                        <Image
                          src={card.imageUrl}
                          alt={card.name}
                          fill
                          className="object-contain rounded"
                          unoptimized
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-sm truncate text-white">{card.name}</h4>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>{card.type}</p>
                    <p className="text-xs font-semibold mt-1" style={{ color: rs.label }}>{card.rarity}</p>
                    {card.hp && (
                      <p className="text-xs" style={{ color: '#64748b' }}>HP {card.hp}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl">❓</div>
                    <p className="text-xs mt-2" style={{ color: '#64748b' }}>Click to reveal</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
