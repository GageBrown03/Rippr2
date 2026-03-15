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
  Common: 5, Uncommon: 15, Rare: 50, 'Holo Rare': 150, 'Ultra Rare': 500,
};

function getStyle(rarity: string) {
  return RARITY_STYLES[rarity] || RARITY_STYLES['Common'];
}

export default function CardReveal({ cards, onClose, onSellUpdate }: CardRevealProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set(cards.map((_, i) => i)));
  const [selling, setSelling] = useState(false);
  const [sellMessage, setSellMessage] = useState('');

  const rarityCounts: Record<string, number> = {};
  cards.forEach((card) => { rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + 1; });

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
        setSellMessage(`Sold ${data.data.cardsSold} ${rarity} for 🪙 ${data.data.coinsEarned.toLocaleString()}`);
        if (onSellUpdate) onSellUpdate(data.data.newCoins);
      } else {
        setSellMessage(data.error || 'Failed to sell');
      }
    } catch { setSellMessage('Failed to sell cards'); }
    finally { setSelling(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 70%, transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white">Pack Results ({cards.length} cards)</h2>
            <div className="flex gap-2">
              <button onClick={() => setRevealed(new Set(cards.map((_, i) => i)))}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
              >Reveal All</button>
              <button onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #E3350D, #c62d0a)', color: '#fff' }}
              >Close</button>
            </div>
          </div>
          {/* Sell bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>Sell:</span>
            {['Common', 'Uncommon', 'Rare'].map((rarity) => {
              const count = rarityCounts[rarity] || 0;
              const value = SELL_VALUES[rarity] || 0;
              const rs = getStyle(rarity);
              return (
                <button key={rarity} onClick={() => handleSellRarity(rarity)} disabled={selling || count === 0}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: `${rs.border}20`, color: rs.label, border: `1px solid ${rs.border}40` }}
                >All {rarity} ({count}) · 🪙 {(count * value).toLocaleString()}</button>
              );
            })}
            {sellMessage && <span className="text-[10px] font-medium ml-auto" style={{ color: '#4ADE80' }}>{sellMessage}</span>}
          </div>
        </div>
      </div>

      {/* Scrollable card grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {cards.map((card, index) => {
              const rs = getStyle(card.rarity);
              const isRevealed = revealed.has(index);
              return (
                <div key={`${card.id}-${index}`} onClick={() => setRevealed((prev) => new Set(prev).add(index))}
                  className="cursor-pointer rounded-xl p-2 transition-all duration-300 hover:scale-[1.03]"
                  style={isRevealed
                    ? { background: '#1a1f2e', border: `2px solid ${rs.border}`, boxShadow: `0 0 12px ${rs.glow}` }
                    : { background: '#0f172a', border: '2px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {isRevealed ? (
                    <div className="text-center">
                      {card.imageUrl && (
                        <div className="relative w-full aspect-[3/4] mb-1.5 rounded-lg overflow-hidden">
                          <Image src={card.imageUrl} alt={card.name} fill className="object-contain rounded" unoptimized />
                        </div>
                      )}
                      <h4 className="font-bold text-[11px] truncate text-white">{card.name}</h4>
                      <p className="text-[10px] font-semibold" style={{ color: rs.label }}>{card.rarity}</p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-3xl">❓</div>
                      <p className="text-[10px] mt-1" style={{ color: '#64748b' }}>Tap</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
