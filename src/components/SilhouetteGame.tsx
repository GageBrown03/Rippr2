'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import GameTimer from './GameTimer';
import { SilhouetteChallenge, SilhouetteResult, ApiResponse } from '@/types';
import { SILHOUETTE_CONFIG } from '@/lib/minigame-engine';
import { getSilhouetteEffect } from '@/lib/image-processing';

type GameState = 'loading' | 'playing' | 'result' | 'error';

export default function SilhouetteGame() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [challenge, setChallenge] = useState<SilhouetteChallenge | null>(null);
  const [result, setResult] = useState<SilhouetteResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNewChallenge = async () => {
    setGameState('loading');
    setChallenge(null);
    setResult(null);
    setSelectedAnswer('');
    setError('');

    try {
      const response = await fetch('/api/minigames/silhouette');
      const data: ApiResponse<SilhouetteChallenge> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to load challenge');
      }

      setChallenge(data.data);
      setStartTime(Date.now());
      setGameState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load challenge');
      setGameState('error');
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!challenge || isSubmitting) return;
    setIsSubmitting(true);
    const responseTime = Date.now() - startTime;

    try {
      const response = await fetch('/api/minigames/silhouette/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: challenge.cardId, answer, responseTime }),
      });
      const data: ApiResponse<SilhouetteResult> = await response.json();
      if (!data.success || !data.data) throw new Error(data.error || 'Failed to submit');
      setResult(data.data);
      setGameState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
      setGameState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    submitAnswer(answer);
  };

  const handleTimeUp = () => {
    if (gameState === 'playing' && !isSubmitting) {
      submitAnswer(selectedAnswer || '');
    }
  };

  useEffect(() => { loadNewChallenge(); }, []);

  const silhouetteEffect = getSilhouetteEffect();

  if (gameState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p style={{ color: '#94a3b8' }}>Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="text-center py-8">
        <div className="rounded-xl p-6 max-w-md mx-auto" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ color: '#fca5a5' }} className="mb-4">{error}</p>
          <button onClick={loadNewChallenge}
            className="px-6 py-2 rounded-lg font-semibold text-white cursor-pointer hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>Try Again</button>
        </div>
      </div>
    );
  }

  if (gameState === 'result' && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center p-8 rounded-xl" style={{
          background: result.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `2px solid ${result.correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: result.correct ? '#4ADE80' : '#FCA5A5' }}>
            {result.correct ? '🎉 Correct!' : '❌ Incorrect'}
          </h2>
          {challenge && (
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image src={challenge.imageUrl} alt={result.correctAnswer} fill className="object-contain rounded-lg" unoptimized />
            </div>
          )}
          <p className="text-xl font-semibold text-white mb-4">{result.correctAnswer}</p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xs" style={{ color: '#64748b' }}>Time</p>
              <p className="text-xl font-bold text-white">{(result.responseTime / 1000).toFixed(2)}s</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xs" style={{ color: '#64748b' }}>Earned</p>
              <p className="text-xl font-bold" style={{ color: '#FACC15' }}>{result.creditsEarned} 🪙</p>
            </div>
          </div>
          <button onClick={loadNewChallenge}
            className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && challenge) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <GameTimer duration={SILHOUETTE_CONFIG.timeLimit} onTimeUp={handleTimeUp} isActive={true} />
        </div>

        <div className="rounded-xl p-8 mb-6" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Who&apos;s That Pokémon?</h2>
          <div className="relative w-full aspect-square max-w-sm mx-auto mb-8 rounded-lg overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
            <Image src={challenge.imageUrl} alt="Mystery Pokémon" fill
              className="object-contain p-8" style={{ filter: silhouetteEffect.filter }} unoptimized />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {challenge.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerSelect(option)} disabled={isSubmitting}
                className="w-full p-4 text-lg font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: selectedAnswer === option ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                  border: selectedAnswer === option ? '2px solid #6366F1' : '2px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                }}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
