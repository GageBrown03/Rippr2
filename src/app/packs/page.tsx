'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import PackCard from '@/components/PackCard';
import CardReveal from '@/components/CardReveal';
import PackOpeningAnimation from '@/components/PackOpeningAnimation';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { User, Pack, Card } from '@/types';

export default function PacksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [revealedCards, setRevealedCards] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [animatingPack, setAnimatingPack] = useState<{ pack: Pack; cards: Card[] } | null>(null);
  const [error, setError] = useState('');
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
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
        setOpening(false);
        return;
      }

      const openedPack = packs.find((p) => p.id === packId);
      if (openedPack) {
        setAnimatingPack({ pack: openedPack, cards: data.data.cards });
      }

      setUser((prev) => prev ? { ...prev, coins: data.data.newCoins } : null);
    } catch (err) {
      console.error('Failed to open pack:', err);
      setError('An unexpected error occurred');
      setOpening(false);
    }
  }

  function handleAnimationComplete() {
    if (animatingPack) {
      setRevealedCards(animatingPack.cards);
      setAnimatingPack(null);
    }
    setOpening(false);
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

  async function handleAddBalance() {
    try {
      const res = await fetch('/api/coins/add', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => prev ? { ...prev, coins: data.data.newCoins } : null);
      }
    } catch (err) {
      console.error('Failed to add balance:', err);
    }
  }

  function handleSellUpdate(newCoins: number) {
    setUser((prev) => prev ? { ...prev, coins: newCoins } : null);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: '#0a0a15' }}>
        <Navbar user={user} coins={user?.coins ?? 0} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-white">Open Packs</h1>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleAddBalance}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: '#818CF8',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                + Add 5,000 🪙
              </button>
              <button
                onClick={handleClaimDaily}
                disabled={dailyClaimed}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: dailyClaimed ? '#374151' : 'linear-gradient(135deg, #FACC15, #EAB308)',
                  color: dailyClaimed ? '#9CA3AF' : '#000',
                  boxShadow: dailyClaimed ? 'none' : '0 4px 16px rgba(234,179,8,0.3)',
                }}
              >
                {dailyClaimed ? 'Daily Claimed ✓' : 'Claim 100 Daily 🪙'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg mb-4 px-4 py-3 text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16" style={{ color: '#64748b' }}>Loading packs...</div>
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

          {/* ═══ LOADING OVERLAY (while API processes) ═══ */}
          {opening && !animatingPack && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #0a0a15 100%)' }}>
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: '4px solid rgba(255,255,255,0.1)',
                      borderTopColor: '#8B5CF6',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <div className="absolute inset-2 flex items-center justify-center text-3xl">🎴</div>
                </div>
                <p className="text-white/70 text-lg font-semibold animate-pulse">Preparing your packs…</p>
                <p className="text-white/30 text-sm mt-1">Shuffling cards</p>
              </div>
            </div>
          )}

          {animatingPack && (
            <PackOpeningAnimation
              packImageUrl={animatingPack.pack.imageUrl}
              packName={animatingPack.pack.name}
              cards={animatingPack.cards}
              onComplete={handleAnimationComplete}
            />
          )}

          {revealedCards && (
            <CardReveal
              cards={revealedCards}
              onClose={() => setRevealedCards(null)}
              onSellUpdate={handleSellUpdate}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
