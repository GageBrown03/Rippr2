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

export default function GuessGame() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    loadChallenge();
  }, []);

  useEffect(() => {
    if (!challenge || result) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - challenge.startTime;
      const remaining = Math.max(0, 10 - Math.floor(elapsed / 1000));
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
      setTimeLeft(10);
      setResult(null);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Error loading challenge:', error);
      alert('Failed to load challenge. Please try again.');
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
      setResult({
        ...data,
        message: 'Time\'s up!',
      });
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
      alert('Failed to submit answer. Please try again.');
      setSubmitting(false);
      setSelectedAnswer(null);
    }
  }

  function getTimerColor() {
    if (timeLeft > 7) return 'text-green-600';
    if (timeLeft > 3) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getRewardTier(responseTime: number) {
    if (responseTime <= 3000) return { tier: 'Lightning Fast!', color: 'text-green-600' };
    if (responseTime <= 7000) return { tier: 'Quick!', color: 'text-yellow-600' };
    return { tier: 'Made it!', color: 'text-orange-600' };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-xl text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Failed to load challenge</p>
          <button
            onClick={loadChallenge}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎯 Guess That Pokémon!
            </h1>
            <p className="text-gray-600">
              Identify the Pokémon and earn credits
            </p>
          </div>

          {/* Timer */}
          {!result && (
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${getTimerColor()} transition-colors`}>
                {timeLeft}s
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Card Image */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="relative w-full aspect-[3/4] max-w-sm mx-auto">
              <Image
                src={challenge.imageUrl}
                alt="Pokémon to guess"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {result.correct ? '✅' : '❌'}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {result.message || (result.correct ? 'Correct!' : 'Wrong!')}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  The answer was: <span className="font-bold">{result.correctAnswer}</span>
                </p>

                {result.correct && result.creditsEarned > 0 && (
                  <div className="mb-4">
                    <div className={`text-xl font-bold ${getRewardTier(result.responseTime).color}`}>
                      {getRewardTier(result.responseTime).tier}
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mt-2">
                      +{result.creditsEarned} Credits!
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Response time: {(result.responseTime / 1000).toFixed(2)}s
                    </p>
                  </div>
                )}

                {result.correct && result.creditsEarned === 0 && (
                  <p className="text-gray-600 mb-4">
                    No credits earned - too slow!
                  </p>
                )}

                <button
                  onClick={loadChallenge}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Next Challenge →
                </button>
              </div>
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
                  className={
                    `w-full bg-white border-2 rounded-lg p-4 text-lg font-semibold transition-all ${
                      submitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                    } ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`
                  }
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
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Minigames
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
