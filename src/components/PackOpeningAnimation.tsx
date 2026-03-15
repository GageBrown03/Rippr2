'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { Card } from '@/types';

export type PackOpeningAnimationProps = {
  packImageUrl: string;
  packName: string;
  cards: Card[];
  onComplete: () => void;
};

type AnimationStage = 'tear' | 'cascade' | 'picking' | 'done';
type CardState = 'hidden' | 'facedown' | 'scrolling' | 'revealed';

const RARITY_COLORS: Record<string, { border: string; glow: string; bg: string; label: string }> = {
  Common:      { border: '#9CA3AF', glow: 'rgba(156,163,175,0.4)', bg: '#374151', label: '#9CA3AF' },
  Uncommon:    { border: '#22C55E', glow: 'rgba(34,197,94,0.5)',   bg: '#14532D', label: '#4ADE80' },
  Rare:        { border: '#3B82F6', glow: 'rgba(59,130,246,0.6)',  bg: '#1E3A5F', label: '#60A5FA' },
  'Holo Rare': { border: '#A855F7', glow: 'rgba(168,85,247,0.7)', bg: '#3B0764', label: '#C084FC' },
  'Ultra Rare':{ border: '#EAB308', glow: 'rgba(234,179,8,0.8)',  bg: '#422006', label: '#FACC15' },
};

const REEL_SEQUENCE = [
  'Common','Uncommon','Common','Rare','Common','Uncommon','Common',
  'Holo Rare','Common','Rare','Uncommon','Common','Ultra Rare',
  'Common','Uncommon','Rare','Common','Uncommon','Common','Rare',
];

function getRarityStyle(rarity: string) {
  return RARITY_COLORS[rarity] || RARITY_COLORS['Common'];
}

/* ────────────── Scroll Reel Overlay ────────────── */
function ScrollReel({ card, onDone }: { card: Card; onDone: () => void }) {
  const reelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'spinning' | 'landed' | 'flipping' | 'done'>('spinning');
  const SLOT_H = 140;

  // Build reel: 20 rarity slots + the real card's rarity as the final slot
  const reelItems = useRef<string[]>([
    ...REEL_SEQUENCE,
    card.rarity,
  ]).current;

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    const targetY = (reelItems.length - 1) * SLOT_H;

    // Reset position instantly
    el.style.transition = 'none';
    el.style.transform = 'translateY(0)';
    void el.offsetHeight; // force reflow

    // Animate with deceleration
    el.style.transition = 'transform 2.4s cubic-bezier(0.12, 0.8, 0.2, 1)';
    el.style.transform = `translateY(-${targetY}px)`;

    const t1 = setTimeout(() => setPhase('landed'), 2500);
    const t2 = setTimeout(() => setPhase('flipping'), 2900);
    const t3 = setTimeout(() => {
      setPhase('done');
      onDone();
    }, 3700);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = getRarityStyle(card.rarity);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">

        {/* Reel viewport */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            width: 220,
            height: SLOT_H,
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4)',
          }}
        >
          {/* Selection brackets */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white/50 text-xl select-none">▸</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white/50 text-xl select-none">◂</div>

          {/* Top / bottom fade masks */}
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-[5] pointer-events-none" />

          {phase !== 'flipping' && phase !== 'done' ? (
            <div ref={reelRef} className="flex flex-col" style={{ willChange: 'transform' }}>
              {reelItems.map((rarity, i) => {
                const s = getRarityStyle(rarity);
                const isLast = i === reelItems.length - 1;
                return (
                  <div
                    key={i}
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 220,
                      height: SLOT_H,
                      background: `linear-gradient(145deg, ${s.bg}, #0a0a15)`,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isLast ? `inset 0 0 30px ${s.glow}` : 'none',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
                        style={{
                          border: `3px solid ${s.border}`,
                          color: s.border,
                          boxShadow: `0 0 12px ${s.glow}`,
                        }}
                      >
                        ?
                      </div>
                      <span
                        className="text-xs font-bold tracking-widest uppercase"
                        style={{ color: s.label }}
                      >
                        {rarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── Flip to card face ─── */
            <div className="w-full h-full" style={{ perspective: 1000 }}>
              <div
                className="w-full h-full relative"
                style={{
                  animation: 'reelFlipReveal 0.6s ease-out forwards',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Front face = card image */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-xl flex items-center justify-center"
                  style={{
                    border: `3px solid ${style.border}`,
                    boxShadow: `0 0 40px ${style.glow}, 0 0 80px ${style.glow}`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-white text-center p-4" style={{ background: style.bg }}>
                      <div className="font-bold">{card.name}</div>
                    </div>
                  )}
                </div>
                {/* Back face = rarity card back */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(145deg, ${style.bg}, #0a0a15)`,
                    border: `3px solid ${style.border}`,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
                    style={{ border: `3px solid ${style.border}`, color: style.border }}
                  >
                    ?
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card name + rarity (after landing) */}
        {(phase === 'landed' || phase === 'flipping' || phase === 'done') && (
          <div className="text-center" style={{ animation: 'fadeInUp 0.4s ease-out backwards' }}>
            <h3 className="text-white font-bold text-xl drop-shadow-lg">{card.name}</h3>
            <span
              className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase"
              style={{
                color: style.label,
                border: `1px solid ${style.border}`,
                background: style.bg,
                boxShadow: `0 0 16px ${style.glow}`,
              }}
            >
              {card.rarity}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────── Particle Burst (rare+ cards) ────────────── */
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

/* ────────────── Main Component ────────────── */
export default function PackOpeningAnimation({
  packImageUrl,
  packName,
  cards,
  onComplete,
}: PackOpeningAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>('tear');
  const [cardStates, setCardStates] = useState<CardState[]>(cards.map(() => 'hidden'));
  const [scrollingIndex, setScrollingIndex] = useState<number | null>(null);
  const [burstIndex, setBurstIndex] = useState<number | null>(null);

  /* ── Auto-progress: tear → cascade ── */
  useEffect(() => {
    const t = setTimeout(() => setStage('cascade'), 1600);
    return () => clearTimeout(t);
  }, []);

  /* ── Cascade: stagger cards face-down ── */
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
        }, i * 180 + 100),
      );
    });

    timers.push(setTimeout(() => setStage('picking'), cards.length * 180 + 500));
    return () => timers.forEach(clearTimeout);
  }, [stage, cards]);

  /* ── Card click → open reel ── */
  const handleCardClick = useCallback(
    (index: number) => {
      if (stage !== 'picking' || cardStates[index] !== 'facedown' || scrollingIndex !== null) return;
      setScrollingIndex(index);
      setCardStates((prev) => { const n = [...prev]; n[index] = 'scrolling'; return n; });
    },
    [stage, cardStates, scrollingIndex],
  );

  /* ── Reel done → reveal card ── */
  const handleScrollDone = useCallback(() => {
    if (scrollingIndex === null) return;
    const idx = scrollingIndex;
    const card = cards[idx];
    const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);

    setCardStates((prev) => { const n = [...prev]; n[idx] = 'revealed'; return n; });

    if (isRarePlus) {
      setBurstIndex(idx);
      setTimeout(() => setBurstIndex(null), 900);
    }
    setScrollingIndex(null);
  }, [scrollingIndex, cards]);

  /* ── Check all revealed ── */
  const allRevealed = cardStates.every((s) => s === 'revealed');
  useEffect(() => {
    if (allRevealed && stage === 'picking') {
      const t = setTimeout(() => setStage('done'), 600);
      return () => clearTimeout(t);
    }
  }, [allRevealed, stage]);

  const revealedCount = cardStates.filter((s) => s === 'revealed').length;

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
          {/* Light burst through the tear */}
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
          {/* Label */}
          <div className="absolute -bottom-12 inset-x-0 text-center">
            <span className="text-white/70 font-bold text-lg tracking-wide animate-pulse">
              Opening {packName}…
            </span>
          </div>
        </div>
      )}

      {/* ═══ CASCADE / PICKING / DONE ═══ */}
      {stage !== 'tear' && (
        <div className="w-full max-w-5xl px-4 flex flex-col items-center gap-6 sm:gap-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-white/50 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
              {packName}
            </h2>
            {stage === 'picking' && !allRevealed && (
              <p className="text-white/30 text-xs mt-1">
                Tap a card to reveal · {revealedCount} / {cards.length}
              </p>
            )}
          </div>

          {/* Card grid */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4">
            {cards.map((card, i) => {
              const state = cardStates[i];
              const rs = getRarityStyle(card.rarity);
              const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);

              return (
                <div
                  key={`${card.id}-${i}`}
                  className="relative"
                  style={{ width: 'clamp(72px, 14vw, 130px)', aspectRatio: '3 / 4' }}
                >
                  {/* Hidden */}
                  {state === 'hidden' && <div className="w-full h-full rounded-xl bg-white/[0.03]" />}

                  {/* Face-down */}
                  {state === 'facedown' && (
                    <button
                      onClick={() => handleCardClick(i)}
                      className="w-full h-full rounded-xl transition-transform duration-150 hover:scale-[1.06] active:scale-95 focus:outline-none cursor-pointer"
                      style={{
                        animation: 'cascadeIn 0.45s ease-out backwards',
                        background: 'linear-gradient(150deg, #1e293b 0%, #0f172a 100%)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-1.5">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
                          <span className="text-white/30 text-lg sm:text-xl font-bold">?</span>
                        </div>
                        <span className="text-white/25 text-[8px] sm:text-[10px] font-medium tracking-widest uppercase">
                          Tap
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Scrolling placeholder */}
                  {state === 'scrolling' && (
                    <div
                      className="w-full h-full rounded-xl"
                      style={{
                        background: 'linear-gradient(150deg, #1e293b, #0f172a)',
                        border: '2px solid rgba(139,92,246,0.5)',
                        boxShadow: '0 0 24px rgba(139,92,246,0.25)',
                        animation: 'scrollingPulse 0.6s ease-in-out infinite',
                      }}
                    />
                  )}

                  {/* Revealed */}
                  {state === 'revealed' && (
                    <div
                      className="w-full h-full rounded-xl overflow-hidden relative"
                      style={{
                        animation: 'revealPop 0.4s ease-out backwards',
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

      {/* ═══ SCROLL REEL OVERLAY ═══ */}
      {scrollingIndex !== null && (
        <ScrollReel card={cards[scrollingIndex]} onDone={handleScrollDone} />
      )}
    </div>
  );
}
