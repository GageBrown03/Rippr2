'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Challenge {
  cardId: string;
  imageUrl: string;
  options: string[];
  startTime: number;
}

interface Result {
  correct: boolean;
  correctAnswer: string;
  creditsEarned: number;
  responseTime: number;
  message?: string;
}

const TIME_LIMIT = 15;

export default function GuessGame() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    loadChallenge();
  }, []);

  useEffect(() => {
    if (!challenge || result) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - challenge.startTime;
      const remaining = Math.max(0, TIME_LIMIT - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        handleTimeout();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [challenge, result]);

  async function loadChallenge() {
    try {
      setLoading(true);
      const response = await fetch('/api/minigames/guess');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to load challenge');
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
          startTime: challenge.startTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const data = await response.json();
      setResult({ ...data, message: "Time's up!" });
    } catch (error) {
      console.error('Error submitting timeout:', error);
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
          startTime: challenge.startTime,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setSubmitting(false);
      setSelectedAnswer(null);
    }
  }

  function getTimerColor() {
    if (timeLeft > 10) return '#4ADE80';
    if (timeLeft > 5) return '#FACC15';
    return '#EF4444';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a15' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
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
          <button
            onClick={loadChallenge}
            className="px-6 py-3 rounded-lg font-semibold text-white cursor-pointer hover:brightness-110 transition-all"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a15' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            🎯 Guess That Pokémon!
          </h1>
          <p style={{ color: '#94a3b8' }} className="text-sm">
            Correct answer = <span style={{ color: '#FACC15' }} className="font-bold">🪙 1,000 coins</span>
          </p>
        </div>

        {/* Timer */}
        {!result && (
          <div className="text-center mb-6">
            <div className="text-5xl font-bold transition-colors" style={{ color: getTimerColor() }}>
              {timeLeft}s
            </div>
            <div className="w-full rounded-full h-2 mt-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-2 rounded-full transition-all duration-100"
                style={{
                  width: `${(timeLeft / TIME_LIMIT) * 100}%`,
                  background: getTimerColor(),
                }}
              />
            </div>
          </div>
        )}

        {/* Card Image */}
        <div className="rounded-xl p-6 mb-6" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="relative w-full aspect-[3/4] max-w-xs mx-auto">
            <Image
              src={challenge.imageUrl}
              alt="Pokémon to guess"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-6xl mb-4">
              {result.correct ? '✅' : '❌'}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.message || (result.correct ? 'Correct!' : 'Wrong!')}
            </h2>
            <p className="text-lg mb-4" style={{ color: '#94a3b8' }}>
              The answer was: <span className="font-bold text-white">{result.correctAnswer}</span>
            </p>

            {result.correct && result.creditsEarned > 0 && (
              <div className="mb-4">
                <div className="text-3xl font-bold mt-2" style={{ color: '#FACC15' }}>
                  +{result.creditsEarned.toLocaleString()} Coins! 🪙
                </div>
                <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                  Response time: {(result.responseTime / 1000).toFixed(2)}s
                </p>
              </div>
            )}

            {result.correct && result.creditsEarned === 0 && (
              <p className="mb-4" style={{ color: '#94a3b8' }}>No coins earned — too slow!</p>
            )}

            <button
              onClick={loadChallenge}
              className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
            >
              Next Challenge →
            </button>
          </div>
        )}

        {/* Options */}
        {!result && (
          <div className="grid grid-cols-1 gap-3">
            {challenge.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSubmit(option)}
                disabled={submitting}
                className="w-full rounded-xl p-4 text-lg font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: selectedAnswer === option ? 'rgba(99,102,241,0.2)' : '#1a1f2e',
                  border: selectedAnswer === option ? '2px solid #6366F1' : '2px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    (e.target as HTMLElement).style.borderColor = '#6366F1';
                    (e.target as HTMLElement).style.background = 'rgba(99,102,241,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer !== option) {
                    (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.target as HTMLElement).style.background = '#1a1f2e';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/minigames"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            ← Back to Minigames
          </Link>
        </div>
      </div>
    </div>
  );
}
