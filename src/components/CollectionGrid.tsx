'use client';

import type { UserCardWithCard } from '@/types';
import Image from 'next/image';

export type CollectionGridProps = {
  userCards: UserCardWithCard[];
  onToggleShowcase: (userCardId: string) => void;
};

const RARITY_STYLES: Record<string, { border: string; glow: string; bg: string; label: string }> = {
  Common:       { border: '#6B7280', glow: 'rgba(107,114,128,0.2)', bg: '#1f2937', label: '#9CA3AF' },
  Uncommon:     { border: '#22C55E', glow: 'rgba(34,197,94,0.2)',   bg: '#14532D20', label: '#4ADE80' },
  Rare:         { border: '#3B82F6', glow: 'rgba(59,130,246,0.25)', bg: '#1E3A5F20', label: '#60A5FA' },
  'Holo Rare':  { border: '#A855F7', glow: 'rgba(168,85,247,0.3)', bg: '#3B076420', label: '#C084FC' },
  'Ultra Rare': { border: '#EAB308', glow: 'rgba(234,179,8,0.3)',  bg: '#42200620', label: '#FACC15' },
};

function getStyle(rarity: string) {
  return RARITY_STYLES[rarity] || RARITY_STYLES['Common'];
}

export default function CollectionGrid({ userCards, onToggleShowcase }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {userCards.map((userCard) => {
        const rs = getStyle(userCard.card.rarity);
        return (
          <div
            key={userCard.id}
            className="rounded-xl p-3 relative transition-all hover:scale-[1.02]"
            style={{
              background: '#1a1f2e',
              border: `2px solid ${rs.border}${userCard.showcase ? '' : '55'}`,
              boxShadow: userCard.showcase
                ? `0 0 16px ${rs.glow}, 0 0 0 2px #FACC15`
                : `0 2px 12px rgba(0,0,0,0.4)`,
            }}
          >
            {userCard.showcase && (
              <div
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10"
                style={{ background: '#FACC15', color: '#000' }}
              >
                ★
              </div>
            )}

            <div className="text-center">
              {userCard.card.imageUrl && (
                <div className="relative w-full aspect-[3/4] mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={userCard.card.imageUrl}
                    alt={userCard.card.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h4 className="font-bold text-sm truncate text-white">{userCard.card.name}</h4>
              <p className="text-xs" style={{ color: '#94a3b8' }}>{userCard.card.type}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: rs.label }}>{userCard.card.rarity}</p>
              {userCard.card.hp && (
                <p className="text-xs" style={{ color: '#64748b' }}>HP {userCard.card.hp}</p>
              )}
              {userCard.card.flavorText && (
                <p className="text-xs italic mt-1 line-clamp-2" style={{ color: '#64748b' }}>
                  {userCard.card.flavorText}
                </p>
              )}
              <p className="text-xs mt-1" style={{ color: '#475569' }}>
                {new Date(userCard.pulledAt).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => onToggleShowcase(userCard.id)}
              className="w-full mt-2 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
              style={
                userCard.showcase
                  ? { background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
                  : { background: '#FACC15', color: '#000', boxShadow: '0 2px 8px rgba(250,204,21,0.2)' }
              }
            >
              {userCard.showcase ? 'Remove Showcase' : 'Showcase'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
