'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import CollectionGrid from '@/components/CollectionGrid';
import CollectionFilters from '@/components/CollectionFilters';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { User, UserCardWithCard, CollectionFilters as FilterType } from '@/types';

const SELL_VALUES: Record<string, number> = {
  Common: 5,
  Uncommon: 15,
  Rare: 50,
  'Holo Rare': 150,
  'Ultra Rare': 500,
};

const RARITY_LABEL_COLORS: Record<string, string> = {
  Common: '#9CA3AF',
  Uncommon: '#4ADE80',
  Rare: '#60A5FA',
  'Holo Rare': '#C084FC',
  'Ultra Rare': '#FACC15',
};

export default function CollectionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userCards, setUserCards] = useState<UserCardWithCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({ sortBy: 'newest' });
  const [selling, setSelling] = useState(false);
  const [sellMessage, setSellMessage] = useState('');
  const [showSellAllDialog, setShowSellAllDialog] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) setUser(data.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, []);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.rarity) params.set('rarity', filters.rarity);
      if (filters.type) params.set('type', filters.type);
      if (filters.setName) params.set('setName', filters.setName);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      params.set('limit', '100');

      const res = await fetch(`/api/collection?${params.toString()}`);
      const data = await res.json();
      if (data.success) setUserCards(data.data);
    } catch (err) {
      console.error('Failed to fetch collection:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { fetchCollection(); }, [fetchCollection]);

  async function handleToggleShowcase(userCardId: string) {
    const card = userCards.find((uc) => uc.id === userCardId);
    if (!card) return;

    try {
      const res = await fetch('/api/collection/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCardId, showcase: !card.showcase }),
      });

      const data = await res.json();
      if (data.success) {
        setUserCards((prev) =>
          prev.map((uc) =>
            uc.id === userCardId ? { ...uc, showcase: !uc.showcase } : uc
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle showcase:', err);
    }
  }

  async function handleSellRarity(rarity: string) {
    if (selling) return;
    setSelling(true);
    setSellMessage('');

    try {
      const res = await fetch('/api/collection/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rarity }),
      });
      const data = await res.json();
      if (data.success) {
        setSellMessage(`Sold ${data.data.cardsSold} ${rarity} cards for 🪙 ${data.data.coinsEarned.toLocaleString()}`);
        setUser((prev) => prev ? { ...prev, coins: data.data.newCoins } : null);
        // Re-fetch collection to reflect sold cards
        fetchCollection();
        // Clear message after 3s
        setTimeout(() => setSellMessage(''), 3000);
      } else {
        setSellMessage(data.error || 'Failed to sell');
        setTimeout(() => setSellMessage(''), 3000);
      }
    } catch (err) {
      console.error('Sell error:', err);
      setSellMessage('Failed to sell cards');
      setTimeout(() => setSellMessage(''), 3000);
    } finally {
      setSelling(false);
    }
  }

  async function handleSellAll() {
    if (selling) return;
    setSelling(true);
    setSellMessage('');
    setShowSellAllDialog(false);
    let totalSold = 0; let totalEarned = 0; let lastCoins = 0;
    try {
      for (const rarity of ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare']) {
        const res = await fetch('/api/collection/sell', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rarity }),
        });
        const data = await res.json();
        if (data.success) {
          totalSold += data.data.cardsSold;
          totalEarned += data.data.coinsEarned;
          lastCoins = data.data.newCoins;
        }
      }
      if (totalSold > 0) {
        setSellMessage(`Sold ${totalSold} cards for 🪙 ${totalEarned.toLocaleString()}`);
        setUser((prev) => prev ? { ...prev, coins: lastCoins } : null);
        fetchCollection();
      } else {
        setSellMessage('No cards to sell (showcased cards are protected)');
      }
      setTimeout(() => setSellMessage(''), 4000);
    } catch {
      setSellMessage('Failed to sell cards');
      setTimeout(() => setSellMessage(''), 3000);
    } finally {
      setSelling(false);
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

  function handleFilterChange(newFilters: FilterType) {
    setFilters(newFilters);
  }

  const showcaseCount = userCards.filter((uc) => uc.showcase).length;

  // Count non-showcased cards by rarity for sell buttons
  const sellCounts: Record<string, number> = {};
  userCards.forEach((uc) => {
    if (!uc.showcase) {
      sellCounts[uc.card.rarity] = (sellCounts[uc.card.rarity] || 0) + 1;
    }
  });

  // Total collection value (non-showcased only)
  const totalCollectionValue = userCards
    .filter((uc) => !uc.showcase)
    .reduce((sum, uc) => sum + (SELL_VALUES[uc.card.rarity] || 0), 0);
  const totalSellableCards = userCards.filter((uc) => !uc.showcase).length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: '#0a0a15' }}>
        <Navbar user={user} coins={user?.coins ?? 0} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-3xl font-bold text-white">My Collection</h1>
            <div className="flex items-center gap-3">
              <span style={{ color: '#94a3b8' }} className="text-sm">
                {userCards.length} cards · {showcaseCount}/12 showcased
              </span>
              <button
                onClick={handleAddBalance}
                className="px-3 py-1.5 rounded-lg font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: '#818CF8',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                + Add 5,000 🪙
              </button>
            </div>
          </div>

          {/* Sell Bar */}
          <div className="rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-semibold mr-1" style={{ color: '#64748b' }}>Quick Sell:</span>
            {['Common', 'Uncommon', 'Rare'].map((rarity) => {
              const count = sellCounts[rarity] || 0;
              const value = SELL_VALUES[rarity] || 0;
              const color = RARITY_LABEL_COLORS[rarity] || '#9CA3AF';
              return (
                <button
                  key={rarity}
                  onClick={() => handleSellRarity(rarity)}
                  disabled={selling || count === 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: `${color}15`, color: color, border: `1px solid ${color}40` }}
                >
                  Sell All {rarity} ({count}) · 🪙 {(count * value).toLocaleString()}
                </button>
              );
            })}
            <span className="text-white/20">|</span>
            <button
              onClick={() => setShowSellAllDialog(true)}
              disabled={selling || totalSellableCards === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              Sell Entire Collection · 🪙 {totalCollectionValue.toLocaleString()}
            </button>
            {sellMessage && (
              <span className="text-xs font-medium ml-auto" style={{ color: '#4ADE80' }}>{sellMessage}</span>
            )}
          </div>

          <CollectionFilters onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="text-center py-16" style={{ color: '#64748b' }}>Loading collection...</div>
          ) : userCards.length === 0 ? (
            <div className="text-center py-16" style={{ color: '#64748b' }}>
              No cards yet! Go open some packs!
            </div>
          ) : (
            <CollectionGrid
              userCards={userCards}
              onToggleShowcase={handleToggleShowcase}
            />
          )}
        </main>

        {/* Sell All Confirmation Dialog */}
        {showSellAllDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
            <div className="rounded-2xl p-6 max-w-md mx-4 text-center" style={{ background: '#1a1f2e', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Sell Entire Collection?</h3>
              <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>
                This will sell <span className="font-bold text-white">{totalSellableCards} cards</span> for
              </p>
              <p className="text-2xl font-bold mb-4" style={{ color: '#FACC15' }}>
                🪙 {totalCollectionValue.toLocaleString()}
              </p>
              <p className="text-xs mb-6" style={{ color: '#64748b' }}>
                Showcased cards ({showcaseCount}) will NOT be sold.
                <br />This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowSellAllDialog(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellAll}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: '#fff', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}
                >
                  Sell Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
