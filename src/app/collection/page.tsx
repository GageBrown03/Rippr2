'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import CollectionGrid from '@/components/CollectionGrid';
import CollectionFilters from '@/components/CollectionFilters';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { User, UserCardWithCard, CollectionFilters as FilterType } from '@/types';

export default function CollectionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userCards, setUserCards] = useState<UserCardWithCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({ sortBy: 'newest' });

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

      const res = await fetch(`/api/collection?${params.toString()}`);
      const data = await res.json();
      if (data.success) setUserCards(data.data);
    } catch (err) {
      console.error('Failed to fetch collection:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

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

  function handleFilterChange(newFilters: FilterType) {
    setFilters(newFilters);
  }

  const showcaseCount = userCards.filter((uc) => uc.showcase).length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar user={user} coins={user?.coins ?? 0} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Collection</h1>
            <div className="text-gray-600">
              {userCards.length} cards | {showcaseCount}/12 showcased
            </div>
          </div>

          <CollectionFilters onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading collection...</div>
          ) : userCards.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No cards yet! Go open some packs!
            </div>
          ) : (
            <CollectionGrid
              userCards={userCards}
              onToggleShowcase={handleToggleShowcase}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
