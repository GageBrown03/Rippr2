'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Card } from '@/types';

export type PackOpeningAnimationProps = {
  packImageUrl: string;
  packName: string;
  cards: Card[];
  onComplete: () => void;
};

type AnimationStage = 'shake' | 'open' | 'reveal' | 'complete';

export default function PackOpeningAnimation({
  packImageUrl,
  packName,
  cards,
  onComplete,
}: PackOpeningAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>('shake');
  const [revealedCount, setRevealedCount] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Stage 1: Shake the pack (800ms)
    const shakeTimer = setTimeout(() => {
      setStage('open');
    }, 800);

    return () => clearTimeout(shakeTimer);
  }, []);

  useEffect(() => {
    if (stage === 'open') {
      // Stage 2: Pack opens and disappears (600ms)
      const openTimer = setTimeout(() => {
        setStage('reveal');
      }, 600);

      return () => clearTimeout(openTimer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'reveal') {
      // Stage 3: Cards fly in one by one
      if (revealedCount < cards.length) {
        const revealTimer = setTimeout(() => {
          setRevealedCount((prev) => prev + 1);
          
          // Check if any rare cards to show sparkles
          const currentCard = cards[revealedCount];
          if (currentCard && ['Holo Rare', 'Ultra Rare'].includes(currentCard.rarity)) {
            setShowSparkles(true);
            setTimeout(() => setShowSparkles(false), 1000);
          }
        }, 200); // 200ms delay between each card

        return () => clearTimeout(revealTimer);
      } else {
        // All cards revealed, wait a bit then complete
        const completeTimer = setTimeout(() => {
          setStage('complete');
          onComplete();
        }, 1000);

        return () => clearTimeout(completeTimer);
      }
    }
  }, [stage, revealedCount, cards, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-black z-50 flex items-center justify-center overflow-hidden">
      {/* Sparkle effects for rare cards */}
      {showSparkles && (
        <>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Pack Image - Shake and Open */}
      {stage !== 'reveal' && stage !== 'complete' && (
        <div
          className={`relative w-64 h-96 ${stage === 'shake' ? 'pack-shake' : ''} ${
            stage === 'open' ? 'pack-open' : ''
          }`}
        >
          <Image
            src={packImageUrl}
            alt={packName}
            fill
            className="object-contain drop-shadow-2xl"
            unoptimized
            priority
          />
          {stage === 'shake' && (
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold animate-pulse">
              Opening {packName}...
            </div>
          )}
        </div>
      )}

      {/* Cards Flying In */}
      {stage === 'reveal' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-w-7xl px-4">
            {cards.slice(0, revealedCount).map((card, index) => {
              const isRare = ['Holo Rare', 'Ultra Rare'].includes(card.rarity);
              return (
                <div
                  key={`${card.id}-${index}`}
                  className="card-fly-in"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div
                    className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl ${
                      isRare ? 'glow-pulse' : ''
                    }`}
                  >
                    {/* Card back initially */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center card-flip">
                      <div className="text-6xl">🎴</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
            {revealedCount} / {cards.length} cards revealed
          </div>
        </div>
      )}
    </div>
  );
}