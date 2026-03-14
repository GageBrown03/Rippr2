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
        body: JSON.stringify({
          cardId: challenge.cardId,
          answer: answer,
          responseTime: responseTime,
        }),
      });

      const data: ApiResponse<SilhouetteResult> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      setResult(data.data);
      setGameState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
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

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const silhouetteEffect = getSilhouetteEffect();

  if (gameState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadNewChallenge}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result' && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`text-center p-8 rounded-lg ${
          result.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${
            result.correct ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.correct ? '🎉 Correct!' : '❌ Incorrect'}
          </h2>
          
          <div className="mb-6">
            {challenge && (
              <div className="relative w-64 h-64 mx-auto mb-4">
                <Image
                  src={challenge.imageUrl}
                  alt={result.correctAnswer}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}
            <p className="text-xl font-semibold text-gray-800 mb-2">
              {result.correctAnswer}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-800">
                {(result.responseTime / 1000).toFixed(2)}s
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Credits Earned</p>
              <p className="text-2xl font-bold text-yellow-600">
                {result.creditsEarned}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-700">
              New Balance: <span className="font-bold text-yellow-600">{result.newCoins}</span> credits
            </p>
          </div>

          <button
            onClick={loadNewChallenge}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
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
          <GameTimer
            duration={SILHOUETTE_CONFIG.timeLimit}
            onTimeUp={handleTimeUp}
            isActive={true}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Who's That Pokémon?
          </h2>
          
          <div className="relative w-full aspect-square max-w-md mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
            <Image
              src={challenge.imageUrl}
              alt="Mystery Pokémon"
              fill
              className="object-contain p-8"
              style={{ filter: silhouetteEffect.filter }}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isSubmitting}
                className={`w-full p-4 text-lg font-semibold rounded-lg transition-all ${
                  selectedAnswer === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Reward Tiers:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>⚡ 0-3 seconds: <span className="font-bold">100 Credits</span></li>
            <li>🏃 3-7 seconds: <span className="font-bold">50 Credits</span></li>
            <li>🚶 7-10 seconds: <span className="font-bold">10 Credits</span></li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}