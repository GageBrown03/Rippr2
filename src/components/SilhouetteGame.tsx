'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

type GameState = 'loading' | 'playing' | 'result' | 'error';

interface Challenge {
  cardId: string;
  cardName: string;
  imageUrl: string;      // PokeAPI artwork (for silhouette)
  cardImageUrl: string;  // TCG card art (for reveal)
  options: string[];
  startTime: number;
}

interface Result {
  correct: boolean;
  correctAnswer: string;
  creditsEarned: number;
  responseTime: number;
  newCoins: number;
}

const TIME_LIMIT_MS = 10000;

export default function SilhouetteGame() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const loadChallenge = useCallback(async () => {
    setGameState('loading');
    setChallenge(null);
    setResult(null);
    setSelectedAnswer('');
    setRevealed(false);
    setError('');

    try {
      const res = await fetch('/api/minigames/silhouette');
      const data = await res.json();
      if (!data.success || !data.data) throw new Error(data.error || 'Failed to load');
      setChallenge(data.data);
      setStartTime(Date.now());
      setTimeLeft(10);
      setGameState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load challenge');
      setGameState('error');
    }
  }, []);

  useEffect(() => { loadChallenge(); }, [loadChallenge]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 10 - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && !isSubmitting) {
        submitAnswer('');
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, startTime]);

  async function submitAnswer(answer: string) {
    if (!challenge || isSubmitting) return;
    setIsSubmitting(true);
    setSelectedAnswer(answer);
    const responseTime = Date.now() - startTime;

    try {
      const res = await fetch('/api/minigames/silhouette/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: challenge.cardId, answer, responseTime }),
      });
      const data = await res.json();
      if (!data.success || !data.data) throw new Error(data.error || 'Failed to submit');
      setResult(data.data);
      setRevealed(true);
      setGameState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
      setGameState('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  function getTimerColor() {
    if (timeLeft > 7) return '#4ADE80';
    if (timeLeft > 3) return '#FACC15';
    return '#EF4444';
  }

  if (gameState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p style={{ color: '#94a3b8' }} className="animate-pulse">Searching the tall grass...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="text-center py-8">
        <div className="rounded-xl p-6 max-w-md mx-auto" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ color: '#fca5a5' }} className="mb-4">{error}</p>
          <button onClick={loadChallenge}
            className="px-6 py-2 rounded-lg font-semibold text-white cursor-pointer hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>Try Again</button>
        </div>
      </div>
    );
  }

  if (gameState === 'result' && result && challenge) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center p-8 rounded-xl" style={{
          background: result.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `2px solid ${result.correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: result.correct ? '#4ADE80' : '#FCA5A5' }}>
            {result.correct ? '🎉 Correct!' : '❌ Incorrect'}
          </h2>

          {/* Show the revealed Pokemon artwork */}
          <div className="relative w-52 h-52 mx-auto mb-4">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{ background: result.correct ? 'radial-gradient(circle, #4ADE80, transparent)' : 'radial-gradient(circle, #EF4444, transparent)' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={challenge.imageUrl}
              alt={result.correctAnswer}
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              referrerPolicy="no-referrer"
            />
          </div>

          <p className="text-sm uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>It&apos;s...</p>
          <h3 className="text-3xl font-bold text-white capitalize mb-4">{result.correctAnswer}!</h3>

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

          <button onClick={loadChallenge}
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
        {/* Timer */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold transition-colors" style={{ color: getTimerColor() }}>{timeLeft}s</div>
          <div className="w-full rounded-full h-2 mt-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-2 rounded-full transition-all duration-100"
              style={{ width: `${(timeLeft / 10) * 100}%`, background: getTimerColor() }} />
          </div>
        </div>

        <div className="rounded-xl p-8 mb-6" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Who&apos;s That Pokémon?</h2>

          {/* Silhouette display */}
          <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full blur-2xl animate-pulse"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)' }} />
            {/* The actual Pokemon artwork with silhouette filter */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={challenge.imageUrl}
              alt="Who's that Pokémon?"
              className="w-64 h-64 object-contain relative z-10 transition-all duration-700"
              style={{
                filter: revealed
                  ? 'brightness(1) drop-shadow(0 0 25px rgba(255,255,255,0.5))'
                  : 'brightness(0) drop-shadow(0 0 15px rgba(255,255,255,0.25))',
              }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Multiple choice options */}
          <div className="grid grid-cols-1 gap-3">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => submitAnswer(option)}
                disabled={isSubmitting}
                className="w-full p-4 text-lg font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: selectedAnswer === option ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                  border: selectedAnswer === option ? '2px solid #6366F1' : '2px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Reward info */}
        <div className="flex justify-center gap-6 text-xs" style={{ color: '#64748b' }}>
          <span>⚡ 0-3s: <span style={{ color: '#4ADE80' }} className="font-bold">100 🪙</span></span>
          <span>🏃 3-7s: <span style={{ color: '#FACC15' }} className="font-bold">50 🪙</span></span>
          <span>🚶 7-10s: <span style={{ color: '#FB923C' }} className="font-bold">10 🪙</span></span>
        </div>
      </div>
    );
  }

  return null;
}
