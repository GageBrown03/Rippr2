'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Card } from '@/types';

export type PackOpeningAnimationProps = {
  packImageUrl: string;
  packName: string;
  cards: Card[];
  onComplete: () => void;
};

type AnimationStage = 'tear' | 'cascade' | 'picking' | 'done';
type CardState = 'hidden' | 'facedown' | 'flipping' | 'revealed';

const RARITY_COLORS: Record<string, { border: string; glow: string; bg: string; label: string }> = {
  Common:       { border: '#9CA3AF', glow: 'rgba(156,163,175,0.35)', bg: '#374151', label: '#D1D5DB' },
  Uncommon:     { border: '#22C55E', glow: 'rgba(34,197,94,0.45)',   bg: '#14532D', label: '#4ADE80' },
  Rare:         { border: '#3B82F6', glow: 'rgba(59,130,246,0.55)',  bg: '#1E3A5F', label: '#60A5FA' },
  'Holo Rare':  { border: '#A855F7', glow: 'rgba(168,85,247,0.6)',  bg: '#3B0764', label: '#C084FC' },
  'Ultra Rare': { border: '#EAB308', glow: 'rgba(234,179,8,0.7)',   bg: '#422006', label: '#FACC15' },
};

function getRarityStyle(rarity: string) {
  return RARITY_COLORS[rarity] || RARITY_COLORS['Common'];
}

/* ── Particle burst for rare+ reveals ── */
function ParticleBurst({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * 360;
        const dist = 50 + Math.random() * 30;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: color,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
              animation: `particleBurst 0.7s ease-out ${i * 0.03}s forwards`,
              // @ts-expect-error CSS custom property
              '--bx': `${dx}px`,
              '--by': `${dy}px`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Main Component ── */
export default function PackOpeningAnimation({
  packImageUrl,
  packName,
  cards,
  onComplete,
}: PackOpeningAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>('tear');
  const [cardStates, setCardStates] = useState<CardState[]>(cards.map(() => 'hidden'));
  const [burstIndex, setBurstIndex] = useState<number | null>(null);

  /* Auto-progress: tear → cascade */
  useEffect(() => {
    const t = setTimeout(() => setStage('cascade'), 1600);
    return () => clearTimeout(t);
  }, []);

  /* Cascade: stagger cards face-down */
  useEffect(() => {
    if (stage !== 'cascade') return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    cards.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCardStates((prev) => {
            const n = [...prev];
            n[i] = 'facedown';
            return n;
          });
        }, i * 120 + 100),
      );
    });

    timers.push(setTimeout(() => setStage('picking'), cards.length * 120 + 400));
    return () => timers.forEach(clearTimeout);
  }, [stage, cards]);

  /* Flip a single card */
  const flipCard = useCallback(
    (index: number) => {
      if (cardStates[index] !== 'facedown') return;

      const card = cards[index];
      const rs = getRarityStyle(card.rarity);
      const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);

      setCardStates((prev) => {
        const n = [...prev];
        n[index] = 'flipping';
        return n;
      });

      // After flip animation completes → revealed
      setTimeout(() => {
        setCardStates((prev) => {
          const n = [...prev];
          n[index] = 'revealed';
          return n;
        });
        if (isRarePlus) {
          setBurstIndex(index);
          setTimeout(() => setBurstIndex(null), 900);
        }
      }, 500);
    },
    [cardStates, cards],
  );

  /* Reveal all at once */
  const revealAll = useCallback(() => {
    setCardStates((prev) =>
      prev.map((s) => (s === 'facedown' ? 'flipping' : s)),
    );
    setTimeout(() => {
      setCardStates((prev) => prev.map((s) => (s === 'flipping' ? 'revealed' : s)));
      // Find best card for burst
      const bestIdx = cards.reduce((best, card, i) => {
        const order = ['Ultra Rare', 'Holo Rare', 'Rare'];
        const bestOrder = order.indexOf(cards[best]?.rarity ?? '');
        const curOrder = order.indexOf(card.rarity);
        return curOrder !== -1 && (bestOrder === -1 || curOrder < bestOrder) ? i : best;
      }, 0);
      if (['Rare', 'Holo Rare', 'Ultra Rare'].includes(cards[bestIdx]?.rarity)) {
        setBurstIndex(bestIdx);
        setTimeout(() => setBurstIndex(null), 900);
      }
    }, 500);
  }, [cards]);

  /* Check all revealed → done */
  const allRevealed = cardStates.every((s) => s === 'revealed');
  useEffect(() => {
    if (allRevealed && stage === 'picking') {
      const t = setTimeout(() => setStage('done'), 600);
      return () => clearTimeout(t);
    }
  }, [allRevealed, stage]);

  const revealedCount = cardStates.filter((s) => s === 'revealed').length;
  const anyFaceDown = cardStates.some((s) => s === 'facedown');

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #0a0a15 100%)' }}
    >
      {/* ═══ TEAR STAGE ═══ */}
      {stage === 'tear' && (
        <div className="relative w-56 h-80 sm:w-64 sm:h-96" style={{ perspective: 1000 }}>
          {/* Left half */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 52% 0, 46% 100%, 0 100%)',
              animation: 'tearLeft 1.4s ease-in-out forwards',
              transformOrigin: 'left center',
            }}
          >
            <Image src={packImageUrl} alt={packName} fill className="object-contain" unoptimized priority />
          </div>
          {/* Right half */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 46% 100%)',
              animation: 'tearRight 1.4s ease-in-out forwards',
              transformOrigin: 'right center',
            }}
          >
            <Image src={packImageUrl} alt={packName} fill className="object-contain" unoptimized priority />
          </div>
          {/* Light burst */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ animation: 'lightBurst 1.4s ease-out forwards' }}
          >
            <div
              className="w-3 rounded-full"
              style={{
                height: '120%',
                background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.95) 30%, rgba(255,220,120,0.9) 50%, rgba(255,255,255,0.95) 70%, transparent 95%)',
                filter: 'blur(10px)',
              }}
            />
          </div>
          <div className="absolute -bottom-12 inset-x-0 text-center">
            <span className="text-white/70 font-bold text-lg tracking-wide animate-pulse">
              Opening {packName}…
            </span>
          </div>
        </div>
      )}

      {/* ═══ CASCADE / PICKING / DONE ═══ */}
      {stage !== 'tear' && (
        <div className="w-full max-w-5xl px-4 flex flex-col items-center gap-4 sm:gap-6">
          {/* Header + actions */}
          <div className="text-center flex flex-col items-center gap-2">
            <h2 className="text-white/50 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
              {packName}
            </h2>
            {stage === 'picking' && !allRevealed && (
              <>
                <p className="text-white/30 text-xs">
                  Tap a card to reveal · {revealedCount} / {cards.length}
                </p>
                {anyFaceDown && (
                  <button
                    onClick={revealAll}
                    className="mt-1 px-5 py-1.5 rounded-lg text-sm font-semibold text-white/80 transition-all hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Reveal All
                  </button>
                )}
              </>
            )}
            {stage === 'done' && (
              <p className="text-white/50 text-sm font-medium">All cards revealed!</p>
            )}
          </div>

          {/* Card grid */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {cards.map((card, i) => {
              const state = cardStates[i];
              const rs = getRarityStyle(card.rarity);
              const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);

              return (
                <div
                  key={`${card.id}-${i}`}
                  className="relative"
                  style={{
                    width: 'clamp(68px, 12vw, 120px)',
                    aspectRatio: '3 / 4',
                    perspective: 600,
                  }}
                >
                  {/* Hidden placeholder */}
                  {state === 'hidden' && <div className="w-full h-full rounded-xl bg-white/[0.03]" />}

                  {/* Face-down card */}
                  {state === 'facedown' && (
                    <button
                      onClick={() => flipCard(i)}
                      className="w-full h-full rounded-xl transition-transform duration-150 hover:scale-[1.06] active:scale-95 focus:outline-none cursor-pointer"
                      style={{
                        animation: 'cascadeIn 0.4s ease-out backwards',
                        background: 'linear-gradient(150deg, #1e293b 0%, #0f172a 100%)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-1.5">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
                          <span className="text-white/30 text-lg sm:text-xl font-bold">?</span>
                        </div>
                        <span className="text-white/25 text-[8px] sm:text-[10px] font-medium tracking-widest uppercase">Tap</span>
                      </div>
                    </button>
                  )}

                  {/* Flipping card (3D Y-axis flip) */}
                  {state === 'flipping' && (
                    <div
                      className="w-full h-full rounded-xl overflow-hidden"
                      style={{
                        animation: 'cardFlip3D 0.5s ease-out forwards',
                        transformStyle: 'preserve-3d',
                        border: `2px solid ${rs.border}`,
                        boxShadow: `0 0 20px ${rs.glow}`,
                      }}
                    >
                      {card.imageUrl ? (
                        <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: rs.bg }}>
                          <span className="text-white text-[10px] font-bold text-center px-1">{card.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Revealed card */}
                  {state === 'revealed' && (
                    <div
                      className="w-full h-full rounded-xl overflow-hidden relative"
                      style={{
                        animation: 'revealPop 0.3s ease-out backwards',
                        border: `2px solid ${rs.border}`,
                        boxShadow: isRarePlus
                          ? `0 0 20px ${rs.glow}, 0 0 50px ${rs.glow}, 0 4px 20px rgba(0,0,0,0.5)`
                          : `0 0 12px ${rs.glow}, 0 4px 20px rgba(0,0,0,0.5)`,
                      }}
                    >
                      {burstIndex === i && <ParticleBurst color={rs.border} />}
                      {card.imageUrl ? (
                        <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: rs.bg }}>
                          <span className="text-white text-[10px] font-bold text-center px-1 leading-tight">{card.name}</span>
                        </div>
                      )}
                      {/* Rarity footer */}
                      <div
                        className="absolute bottom-0 inset-x-0 py-1 text-center"
                        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}
                      >
                        <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase" style={{ color: rs.label }}>
                          {card.rarity}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Collect button */}
          {stage === 'done' && (
            <button
              onClick={onComplete}
              className="mt-2 px-8 py-3 rounded-xl font-bold text-white text-base sm:text-lg tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 4px 30px rgba(99,102,241,0.45)',
                animation: 'fadeInUp 0.5s ease-out backwards',
              }}
            >
              Collect Cards →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
