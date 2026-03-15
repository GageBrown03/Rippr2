'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Pack } from '@/types';

type FeaturedCard = {
  imageUrl: string;
  name: string;
  rarity: string;
};

export type PackCardProps = {
  pack: Pack & { featuredCard?: FeaturedCard | null };
  onOpen: (packId: string, quantity: number) => void;
  userCoins: number;
};

export default function PackCard({ pack, onOpen, userCoins }: PackCardProps) {
  const [quantity, setQuantity] = useState(1);
  const totalCost = pack.cost * quantity;
  const canAfford = userCoins >= totalCost;
  const featured = (pack as any).featuredCard as FeaturedCard | null;

  return (
    <div className="rounded-xl overflow-hidden transition-shadow hover:shadow-2xl"
      style={{
        background: '#1a1f2e',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Cover area with featured card */}
      <div className="relative h-56 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        {featured?.imageUrl ? (
          <>
            {/* Background blur of the card */}
            <div className="absolute inset-0 scale-150 opacity-30 blur-xl">
              <Image src={featured.imageUrl} alt="" fill className="object-cover" unoptimized />
            </div>
            {/* Card image, centered */}
            <div className="absolute inset-0 flex items-center justify-center z-[1]">
              <div className="relative w-28 h-40 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.15))' }}>
                <Image src={featured.imageUrl} alt={featured.name} fill className="object-contain" unoptimized />
              </div>
            </div>
            {/* Featured card label */}
            <div className="absolute bottom-2 right-2 z-[2] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)' }}
            >
              Top Pull: {featured.name}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-5xl">🎴</div>
          </div>
        )}
        {/* Pack name overlay */}
        <div className="absolute top-0 inset-x-0 p-3 z-[2]" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
          <h3 className="text-white font-bold text-lg drop-shadow-lg">{pack.name}</h3>
          <p className="text-white/50 text-xs">{pack.setName}</p>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4">
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{pack.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold" style={{ color: '#FACC15' }}>🪙 {pack.cost}/pack</span>
          <span className="text-sm text-gray-500">{pack.cardsPerPack} cards/pack</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <label htmlFor={`qty-${pack.id}`} className="text-sm font-medium text-gray-400">
            Qty:
          </label>
          <select
            id={`qty-${pack.id}`}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded px-2 py-1 text-sm"
            style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-sm text-gray-400 ml-auto">
            Total: 🪙 {totalCost.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onOpen(pack.id, quantity)}
          disabled={!canAfford}
          className="w-full py-2.5 rounded-lg font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            background: canAfford
              ? 'linear-gradient(135deg, #E3350D, #c62d0a)'
              : '#4a5568',
            boxShadow: canAfford ? '0 4px 16px rgba(227,53,13,0.3)' : 'none',
          }}
        >
          {canAfford ? `Open ${quantity} Pack${quantity > 1 ? 's' : ''}` : 'Not enough coins'}
        </button>
      </div>
    </div>
  );
}
