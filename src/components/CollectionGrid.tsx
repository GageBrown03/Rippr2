'use client';

import type { UserCardWithCard } from '@/types';
import Image from 'next/image';

export type CollectionGridProps = {
  userCards: UserCardWithCard[];
  onToggleShowcase: (userCardId: string) => void;
};

const RARITY_STYLES: Record<string, { border: string; glow: string; label: string }> = {
  Common:       { border: '#6B7280', glow: 'rgba(107,114,128,0.2)', label: '#9CA3AF' },
  Uncommon:     { border: '#22C55E', glow: 'rgba(34,197,94,0.2)',   label: '#4ADE80' },
  Rare:         { border: '#3B82F6', glow: 'rgba(59,130,246,0.25)', label: '#60A5FA' },
  'Holo Rare':  { border: '#A855F7', glow: 'rgba(168,85,247,0.3)', label: '#C084FC' },
  'Ultra Rare': { border: '#EAB308', glow: 'rgba(234,179,8,0.3)',  label: '#FACC15' },
};

const DELTA_TYPE_COLORS: Record<string, string> = {
  Fire: '#EF4444', Water: '#3B82F6', Grass: '#22C55E', Electric: '#EAB308',
  Psychic: '#A855F7', Fighting: '#C2410C', Dark: '#6B7280', Dragon: '#6366F1',
  Steel: '#94A3B8', Fairy: '#EC4899',
};

function getStyle(rarity: string) {
  return RARITY_STYLES[rarity] || RARITY_STYLES['Common'];
}

function getGradeBg(grade: number): string {
  if (grade >= 10) return 'linear-gradient(135deg, #EAB308, #F59E0B)';
  if (grade >= 9) return 'linear-gradient(135deg, #6366F1, #818CF8)';
  if (grade >= 7) return '#3B82F6';
  if (grade >= 5) return '#22C55E';
  return '#6B7280';
}

function getGradeLabel(grade: number): string {
  if (grade >= 10) return 'GEM MINT 10';
  if (grade >= 9) return `MINT ${grade}`;
  if (grade >= 7) return `NM ${grade}`;
  if (grade >= 5) return `EX ${grade}`;
  return `${grade}`;
}

export default function CollectionGrid({ userCards, onToggleShowcase }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {userCards.map((userCard) => {
        const rs = getStyle(userCard.card.rarity);
        const hasGrade = userCard.grade !== null && userCard.grade !== undefined;
        const hasDelta = !!userCard.deltaType;
        const deltaColor = hasDelta ? (DELTA_TYPE_COLORS[userCard.deltaType!] || '#A855F7') : '';
        const isHoloBleed = userCard.isHoloBleed;

        return (
          <div
            key={userCard.id}
            className="rounded-xl p-3 relative transition-all hover:scale-[1.02] overflow-hidden"
            style={{
              background: '#1a1f2e',
              border: `2px solid ${isHoloBleed ? 'rgba(255,255,255,0.4)' : rs.border + (userCard.showcase ? '' : '55')}`,
              boxShadow: isHoloBleed
                ? '0 0 20px rgba(255,255,255,0.15), 0 0 40px rgba(168,85,247,0.1)'
                : userCard.showcase
                ? `0 0 16px ${rs.glow}, 0 0 0 2px #FACC15`
                : `0 2px 12px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Holo-Bleed overlay — covers entire card face */}
            {isHoloBleed && (
              <div className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,0,150,0.08), rgba(0,255,255,0.08), rgba(255,255,0,0.08), rgba(150,0,255,0.08), rgba(0,255,150,0.08))',
                  backgroundSize: '400% 400%',
                  animation: 'holoBleedShift 4s ease-in-out infinite',
                  mixBlendMode: 'overlay',
                }} />
            )}
            {isHoloBleed && (
              <div className="absolute inset-0 z-10 pointer-events-none rounded-xl"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                  animation: 'holoBleedSheen 3s ease-in-out infinite',
                }} />
            )}

            {/* Holo-Bleed badge */}
            {isHoloBleed && (
              <div className="absolute bottom-1.5 left-1.5 z-20 px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span className="text-[8px] font-bold" style={{ color: '#fff', textShadow: '0 0 6px rgba(168,85,247,0.8)' }}>🌈 HOLO BLEED</span>
              </div>
            )
            {/* Showcase star */}
            {userCard.showcase && (
              <div className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-20"
                style={{ background: '#FACC15', color: '#000' }}>★</div>
            )}

            {/* Grade badge (PSA slab style) */}
            {hasGrade && (
              <div className="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded-md flex flex-col items-center"
                style={{ background: getGradeBg(userCard.grade!), boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                <span className="text-[7px] font-bold text-white/80 leading-none tracking-wider">PSA</span>
                <span className="text-[11px] font-black text-white leading-none">{userCard.grade}</span>
              </div>
            )}

            {/* Delta Species badge */}
            {hasDelta && (
              <div className="absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${deltaColor}60` }}>
                <span className="text-[9px] font-bold" style={{ color: deltaColor }}>δ {userCard.deltaType}</span>
              </div>
            )}

            <div className="text-center">
              {userCard.card.imageUrl && (
                <div className="relative w-full aspect-[3/4] mb-2 rounded-lg overflow-hidden">
                  {/* Delta type color overlay */}
                  {hasDelta && (
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-lg"
                      style={{ background: `${deltaColor}15`, mixBlendMode: 'overlay' }} />
                  )}
                  {/* Graded slab border effect */}
                  {hasGrade && (
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-lg"
                      style={{
                        border: userCard.grade! >= 9
                          ? '2px solid rgba(234,179,8,0.5)'
                          : userCard.grade! >= 7
                          ? '2px solid rgba(59,130,246,0.4)'
                          : '2px solid rgba(107,114,128,0.3)',
                        boxShadow: userCard.grade! >= 9 ? 'inset 0 0 12px rgba(234,179,8,0.15)' : 'none',
                      }} />
                  )}
                  <Image src={userCard.card.imageUrl} alt={userCard.card.name} fill className="object-contain" unoptimized />
                </div>
              )}
              <h4 className="font-bold text-sm truncate text-white">{userCard.card.name}</h4>
              <p className="text-xs" style={{ color: '#94a3b8' }}>{userCard.card.type}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: rs.label }}>{userCard.card.rarity}</p>
              {userCard.card.hp && (
                <p className="text-xs" style={{ color: '#64748b' }}>HP {userCard.card.hp}</p>
              )}
              {hasGrade && (
                <p className="text-[10px] font-bold mt-0.5" style={{ color: userCard.grade! >= 9 ? '#FACC15' : '#60A5FA' }}>
                  {getGradeLabel(userCard.grade!)}
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
