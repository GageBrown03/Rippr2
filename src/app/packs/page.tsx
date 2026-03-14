'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import PackCard from '@/components/PackCard';
import CardReveal from '@/components/CardReveal';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { User, Pack, Card } from '@/types';

export default function PacksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [revealedCards, setRevealedCards] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        // Check if daily coins were claimed recently (within last 24 hours)
        if (data.data.lastDailyCoins) {
          const lastClaim = new Date(data.data.lastDailyCoins).getTime();
          const now = Date.now();
          const hoursSinceClaim = (now - lastClaim) / (1000 * 60 * 60);
          if (hoursSinceClaim < 24) {
            setDailyClaimed(true);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, []);

  const fetchPacks = useCallback(async () => {
    try {
      const res = await fetch('/api/packs');
      const data = await res.json();
      if (data.success) setPacks(data.data);
    } catch (err) {
      console.error('Failed to fetch packs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchPacks();
  }, [fetchUser, fetchPacks]);

  async function handleOpenPack(packId: string, quantity: number) {
    setOpening(true);
    setError('');

    try {
      const res = await fetch('/api/packs/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, quantity }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to open pack');
        return;
      }

      setRevealedCards(data.data.cards);
      setUser((prev) => prev ? { ...prev, coins: data.data.newCoins } : null);
    } catch (err) {
      console.error('Failed to open pack:', err);
      setError('An unexpected error occurred');
    } finally {
      setOpening(false);
    }
  }

  async function handleClaimDaily() {
    try {
      const res = await fetch('/api/coins/daily', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => prev ? { ...prev, coins: data.data.newCoins, lastDailyCoins: new Date() } : null);
        setDailyClaimed(true);
      } else {
        setError(data.error || 'Failed to claim daily coins');
      }
    } catch (err) {
      console.error('Failed to claim daily coins:', err);
      setError('Failed to claim daily coins');
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar user={user} coins={user?.coins ?? 0} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Open Packs</h1>
            <button
              onClick={handleClaimDaily}
              disabled={dailyClaimed}
              className="btn-secondary"
            >
              {dailyClaimed ? 'Daily Claimed ✓' : 'Claim 100 Daily Coins 🪙'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading packs...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  onOpen={handleOpenPack}
                  userCoins={user?.coins ?? 0}
                />
              ))}
            </div>
          )}

          {opening && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="text-white text-2xl font-bold animate-pulse">
                Opening packs...
              </div>
            </div>
          )}

          {revealedCards && (
            <CardReveal
              cards={revealedCards}
              onClose={() => setRevealedCards(null)}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
