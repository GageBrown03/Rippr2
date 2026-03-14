'use client';

import { useState } from 'react';
import type { Pack } from '@/types';

export type PackCardProps = {
  pack: Pack;
  onOpen: (packId: string, quantity: number) => void;
  userCoins: number;
};

export default function PackCard({ pack, onOpen, userCoins }: PackCardProps) {
  const [quantity, setQuantity] = useState(1);
  const totalCost = pack.cost * quantity;
  const canAfford = userCoins >= totalCost;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-pokeblue to-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-5xl mb-2">🎴</div>
          <div className="text-lg font-bold">{pack.name}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{pack.setName}</p>
        <p className="text-gray-600 text-sm mb-3">{pack.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-pokegold">🪙 {pack.cost}/pack</span>
          <span className="text-sm text-gray-500">{pack.cardsPerPack} cards/pack</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <label htmlFor={`qty-${pack.id}`} className="text-sm font-medium">
            Qty:
          </label>
          <select
            id={`qty-${pack.id}`}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Total: 🪙 {totalCost.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onOpen(pack.id, quantity)}
          disabled={!canAfford}
          className="w-full btn-primary"
        >
          {canAfford ? `Open ${quantity} Pack${quantity > 1 ? 's' : ''}` : 'Not enough coins'}
        </button>
      </div>
    </div>
  );
}
