'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Challenge {
  cardId: string;
  hint: string;
  type: string;
  correctName: string;
  options: string[];
  startTime: number;
}

interface Result {
  correct: boolean;
  correctAnswer: string;
  creditsEarned: number;
  responseTime: number;
  newCoins?: number;
  message?: string;
}

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Fire:     { bg: 'rgba(239,68,68,0.15)', border: '#EF4444', text: '#FCA5A5' },
  Water:    { bg: 'rgba(59,130,246,0.15)', border: '#3B82F6', text: '#93C5FD' },
  Grass:    { bg: 'rgba(34,197,94,0.15)',  border: '#22C55E', text: '#86EFAC' },
  Electric: { bg: 'rgba(234,179,8,0.15)',  border: '#EAB308', text: '#FDE047' },
  Psychic:  { bg: 'rgba(168,85,247,0.15)', border: '#A855F7', text: '#C4B5FD' },
  Fighting: { bg: 'rgba(194,65,12,0.15)',  border: '#C2410C', text: '#FDBA74' },
  Dark:     { bg: 'rgba(107,114,128,0.15)',border: '#6B7280', text: '#D1D5DB' },
  Dragon:   { bg: 'rgba(99,102,241,0.15)', border: '#6366F1', text: '#A5B4FC' },
  Normal:   { bg: 'rgba(156,163,175,0.1)', border: '#9CA3AF', text: '#D1D5DB' },
};

const TIME_LIMIT = 15;

export default function GuessGame() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => { loadChallenge(); }, []);

  useEffect(() => {
    if (!challenge || result) return;
    const timer = setInterval(() => {
      const elapsed = Date.now() - challenge.startTime;
      const remaining = Math.max(0, TIME_LIMIT - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) handleTimeout();
    }, 100);
    return () => clearInterval(timer);
  }, [challenge, result]);

  async function loadChallenge() {
    try {
      setLoading(true);
      const response = await fetch('/api/minigames/guess');
      if (!response.ok) {
        if (response.status === 401) { router.push('/login'); return; }
        throw new Error('Failed to load');
      }
      const data = await response.json();
      setChallenge(data);
      setTimeLeft(TIME_LIMIT);
      setResult(null);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTimeout() {
    if (!challenge || submitting || result) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/minigames/guess/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: challenge.cardId,
          answer: '',
          correctName: challenge.correctName,
          startTime: challenge.startTime,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit');
      const data = await response.json();
      setResult({ ...data, message: "Time's up!" });
    } catch (error) {
      console.error('Timeout error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(answer: string) {
    if (!challenge || submitting || result) return;
    setSelectedAnswer(answer);
    setSubmitting(true);
    try {
      const response = await fetch('/api/minigames/guess/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: challenge.cardId,
          answer,
          correctName: challenge.correctName,
          startTime: challenge.startTime,
        }),
      });
      if (!response.ok) {
        if (response.status === 401) { router.push('/login'); return; }
        throw new Error('Failed to submit');
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitting(false);
      setSelectedAnswer(null);
    }
  }

  function getTimerColor() {
    if (timeLeft > 10) return '#4ADE80';
    if (timeLeft > 5) return '#FACC15';
    return '#EF4444';
  }

  const tc = challenge ? (TYPE_COLORS[challenge.type] || TYPE_COLORS['Normal']) : TYPE_COLORS['Normal'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a15' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <p style={{ color: '#94a3b8' }} className="text-xl">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a15' }}>
        <div className="text-center">
          <p style={{ color: '#94a3b8' }} className="text-xl mb-4">Failed to load challenge</p>
          <button onClick={loadChallenge}
            className="px-6 py-3 rounded-lg font-semibold text-white cursor-pointer hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a15' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">🧠 Who&apos;s That Pokémon?</h1>
          <p style={{ color: '#94a3b8' }} className="text-sm">
            Read the clue, pick the right Pokémon · <span style={{ color: '#FACC15' }} className="font-bold">🪙 1,000 coins</span>
          </p>
        </div>

        {/* Timer */}
        {!result && (
          <div className="text-center mb-6">
            <div className="text-5xl font-bold transition-colors" style={{ color: getTimerColor() }}>{timeLeft}s</div>
            <div className="w-full rounded-full h-2 mt-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-2 rounded-full transition-all duration-100"
                style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%`, background: getTimerColor() }} />
            </div>
          </div>
        )}

        {/* Clue card */}
        <div className="rounded-xl p-6 sm:p-8 mb-6" style={{ background: tc.bg, border: `2px solid ${tc.border}40` }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: `${tc.border}30`, color: tc.text, border: `1px solid ${tc.border}50` }}>
              {challenge.type} Type
            </span>
          </div>
          <p className="text-lg sm:text-xl leading-relaxed font-medium" style={{ color: '#e2e8f0' }}>
            &ldquo;{challenge.hint}&rdquo;
          </p>
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-6xl mb-4">{result.correct ? '✅' : '❌'}</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.message || (result.correct ? 'Correct!' : 'Wrong!')}
            </h2>
            <p className="text-lg mb-4" style={{ color: '#94a3b8' }}>
              The answer was: <span className="font-bold text-white">{result.correctAnswer}</span>
            </p>
            {result.correct && result.creditsEarned > 0 && (
              <div className="mb-4">
                <div className="text-3xl font-bold mt-2" style={{ color: '#FACC15' }}>+{result.creditsEarned.toLocaleString()} Coins! 🪙</div>
                <p className="text-sm mt-1" style={{ color: '#64748b' }}>Response time: {(result.responseTime / 1000).toFixed(2)}s</p>
              </div>
            )}
            {result.correct && result.creditsEarned === 0 && (
              <p className="mb-4" style={{ color: '#94a3b8' }}>No coins earned — too slow!</p>
            )}
            <button onClick={loadChallenge}
              className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              Next Challenge →
            </button>
          </div>
        )}

        {/* Answer options */}
        {!result && (
          <div className="grid grid-cols-1 gap-3">
            {challenge.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAfterSubmit = result && option === challenge.correctName;
              return (
                <button key={option} onClick={() => handleSubmit(option)}
                  disabled={submitting}
                  className="w-full rounded-xl p-4 text-lg font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.2)' : '#1a1f2e',
                    border: isSelected ? '2px solid #6366F1' : '2px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0',
                  }}>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/minigames"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}>
            ← Back to Minigames
          </Link>
        </div>
      </div>
    </div>
  );
}
