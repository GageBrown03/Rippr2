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

/* ── Sound effects via Web Audio API ── */
function useCardSounds() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }

  function playFlip() {
    if (muted) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  function playRevealRare() {
    if (muted) return;
    try {
      const ctx = getCtx();
      // Shimmer chord
      [800, 1200, 1600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4 + i * 0.05);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + 0.5);
      });
    } catch {}
  }

  function playTear() {
    if (muted) return;
    try {
      const ctx = getCtx();
      // Noise burst for paper tear
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      source.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      source.start(ctx.currentTime);
    } catch {}
  }

  return { muted, setMuted, playFlip, playRevealRare, playTear };
}

function ParticleBurst({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * 360;
        const dist = 60 + Math.random() * 40;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <div key={i} className="absolute w-2 h-2 rounded-full"
            style={{
              background: color, left: '50%', top: '50%',
              transform: 'translate(-50%,-50%)',
              animation: `particleBurst 0.7s ease-out ${i * 0.03}s forwards`,
              // @ts-expect-error CSS custom property
              '--bx': `${dx}px`, '--by': `${dy}px`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function PackOpeningAnimation({
  packImageUrl, packName, cards, onComplete,
}: PackOpeningAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>('tear');
  const [cardStates, setCardStates] = useState<CardState[]>(cards.map(() => 'hidden'));
  const [burstIndex, setBurstIndex] = useState<number | null>(null);
  const sounds = useCardSounds();

  useEffect(() => {
    sounds.playTear();
    const t = setTimeout(() => setStage('cascade'), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== 'cascade') return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    cards.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setCardStates((prev) => { const n = [...prev]; n[i] = 'facedown'; return n; });
      }, i * 120 + 100));
    });
    timers.push(setTimeout(() => setStage('picking'), cards.length * 120 + 300));
    return () => timers.forEach(clearTimeout);
  }, [stage, cards]);

  const flipCard = useCallback(
    (index: number) => {
      if (cardStates[index] !== 'facedown') return;
      const card = cards[index];
      const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);

      sounds.playFlip();
      setCardStates((prev) => { const n = [...prev]; n[index] = 'flipping'; return n; });

      setTimeout(() => {
        setCardStates((prev) => { const n = [...prev]; n[index] = 'revealed'; return n; });
        if (isRarePlus) {
          sounds.playRevealRare();
          setBurstIndex(index);
          setTimeout(() => setBurstIndex(null), 900);
        }
      }, 500);
    },
    [cardStates, cards, sounds],
  );

  const revealAll = useCallback(() => {
    sounds.playFlip();
    setCardStates((prev) => prev.map((s) => (s === 'facedown' ? 'flipping' : s)));
    setTimeout(() => {
      setCardStates((prev) => prev.map((s) => (s === 'flipping' ? 'revealed' : s)));
      const hasRare = cards.some(c => ['Rare', 'Holo Rare', 'Ultra Rare'].includes(c.rarity));
      if (hasRare) sounds.playRevealRare();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

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
    <div className="fixed inset-0 z-50 flex flex-col select-none overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #0a0a15 100%)' }}>

      {/* Mute button — always visible */}
      <button
        onClick={() => sounds.setMuted(!sounds.muted)}
        className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        title={sounds.muted ? 'Unmute' : 'Mute'}
      >
        <span className="text-lg">{sounds.muted ? '🔇' : '🔊'}</span>
      </button>

      {/* TEAR STAGE */}
      {stage === 'tear' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-56 h-80 sm:w-64 sm:h-96" style={{ perspective: 1000 }}>
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(0 0, 52% 0, 46% 100%, 0 100%)', animation: 'tearLeft 1.4s ease-in-out forwards', transformOrigin: 'left center' }}>
              <Image src={packImageUrl} alt={packName} fill className="object-contain" unoptimized priority />
            </div>
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 46% 100%)', animation: 'tearRight 1.4s ease-in-out forwards', transformOrigin: 'right center' }}>
              <Image src={packImageUrl} alt={packName} fill className="object-contain" unoptimized priority />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animation: 'lightBurst 1.4s ease-out forwards' }}>
              <div className="w-3 rounded-full" style={{ height: '120%', background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.95) 30%, rgba(255,220,120,0.9) 50%, rgba(255,255,255,0.95) 70%, transparent 95%)', filter: 'blur(10px)' }} />
            </div>
            <div className="absolute -bottom-12 inset-x-0 text-center">
              <span className="text-white/70 font-bold text-lg tracking-wide animate-pulse">Opening {packName}…</span>
            </div>
          </div>
        </div>
      )}

      {/* CARDS STAGE */}
      {stage !== 'tear' && (
        <div className="flex flex-col min-h-full">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 py-4 px-4 text-center" style={{ background: 'linear-gradient(to bottom, #0a0a15 60%, transparent)' }}>
            <h2 className="text-white/50 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">{packName}</h2>
            {stage === 'picking' && !allRevealed && (
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-white/30 text-xs">{revealedCount} / {cards.length}</span>
                {anyFaceDown && (
                  <button onClick={revealAll}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white/80 transition-all hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    Reveal All
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card grid — LARGE cards */}
          <div className="flex-1 flex items-center justify-center px-4 pb-24">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-6xl">
              {cards.map((card, i) => {
                const state = cardStates[i];
                const rs = getRarityStyle(card.rarity);
                const isRarePlus = ['Rare', 'Holo Rare', 'Ultra Rare'].includes(card.rarity);

                return (
                  <div key={`${card.id}-${i}`} className="relative"
                    style={{ width: 'clamp(140px, 22vw, 240px)', aspectRatio: '3 / 4', perspective: 800 }}>
                    {state === 'hidden' && <div className="w-full h-full rounded-2xl bg-white/[0.03]" />}

                    {state === 'facedown' && (
                      <button onClick={() => flipCard(i)}
                        className="w-full h-full rounded-2xl transition-transform duration-150 hover:scale-[1.04] active:scale-95 focus:outline-none cursor-pointer"
                        style={{ animation: 'cascadeIn 0.4s ease-out backwards', background: 'linear-gradient(150deg, #1e293b, #0f172a)', border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
                            <span className="text-white/30 text-2xl sm:text-3xl font-bold">?</span>
                          </div>
                          <span className="text-white/25 text-xs sm:text-sm font-medium tracking-widest uppercase">Tap to Reveal</span>
                        </div>
                      </button>
                    )}

                    {state === 'flipping' && (
                      <div className="w-full h-full rounded-2xl overflow-hidden"
                        style={{ animation: 'cardFlip3D 0.5s ease-out forwards', transformStyle: 'preserve-3d', border: `3px solid ${rs.border}`, boxShadow: `0 0 30px ${rs.glow}` }}>
                        {card.imageUrl ? <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized /> :
                          <div className="w-full h-full flex items-center justify-center" style={{ background: rs.bg }}>
                            <span className="text-white text-sm font-bold text-center px-2">{card.name}</span>
                          </div>}
                      </div>
                    )}

                    {state === 'revealed' && (
                      <div className="w-full h-full rounded-2xl overflow-hidden relative"
                        style={{ animation: 'revealPop 0.3s ease-out backwards', border: `3px solid ${rs.border}`,
                          boxShadow: isRarePlus ? `0 0 25px ${rs.glow}, 0 0 60px ${rs.glow}, 0 8px 30px rgba(0,0,0,0.5)` : `0 0 15px ${rs.glow}, 0 8px 30px rgba(0,0,0,0.5)` }}>
                        {burstIndex === i && <ParticleBurst color={rs.border} />}
                        {card.imageUrl ? <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized /> :
                          <div className="w-full h-full flex items-center justify-center" style={{ background: rs.bg }}>
                            <span className="text-white text-sm font-bold text-center px-2">{card.name}</span>
                          </div>}
                        <div className="absolute bottom-0 inset-x-0 py-1.5 px-2 text-center" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                          <div className="text-white text-xs sm:text-sm font-bold truncate">{card.name}</div>
                          <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase" style={{ color: rs.label }}>{card.rarity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky bottom */}
          {stage === 'done' && (
            <div className="sticky bottom-0 z-10 py-4 text-center" style={{ background: 'linear-gradient(transparent, #0a0a15 40%)' }}>
              <button onClick={onComplete}
                className="px-8 py-3 rounded-xl font-bold text-white text-base sm:text-lg tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 30px rgba(99,102,241,0.45)', animation: 'fadeInUp 0.5s ease-out backwards' }}>
                Collect Cards →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
