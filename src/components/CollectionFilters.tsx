'use client';

import { useState } from 'react';
import type { CollectionFilters } from '@/types';

export type CollectionFiltersProps = {
  onFilterChange: (filters: CollectionFilters) => void;
};

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare'];
const TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Dark', 'Steel', 'Fairy', 'Dragon', 'Normal', 'Ice', 'Ghost', 'Poison'];
const SETS = ['Base Set', 'Premium Full Art', 'Evolving Skies', 'EX Holon Phantoms', 'The Vault: Gold & Silver', 'Diamond & Pearl: LV.X Legends', 'XY: Mega Evolution', 'Pokémon 151', 'Hidden Fates', 'The God Pack'];
const SORT_OPTIONS: { value: CollectionFilters['sortBy']; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rarest', label: 'Rarest First' },
  { value: 'alphabetical', label: 'A-Z' },
];

const selectStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#e2e8f0',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  padding: '6px 10px',
  fontSize: 13,
};

export default function CollectionFiltersComponent({ onFilterChange }: CollectionFiltersProps) {
  const [rarity, setRarity] = useState('');
  const [type, setType] = useState('');
  const [setName, setSetName] = useState('');
  const [sortBy, setSortBy] = useState<CollectionFilters['sortBy']>('newest');

  function handleChange(
    newRarity?: string,
    newType?: string,
    newSetName?: string,
    newSortBy?: CollectionFilters['sortBy']
  ) {
    const r = newRarity ?? rarity;
    const t = newType ?? type;
    const s = newSetName ?? setName;
    const sb = newSortBy ?? sortBy;

    if (newRarity !== undefined) setRarity(r);
    if (newType !== undefined) setType(t);
    if (newSetName !== undefined) setSetName(s);
    if (newSortBy !== undefined) setSortBy(sb);

    onFilterChange({
      rarity: r || undefined,
      type: t || undefined,
      setName: s || undefined,
      sortBy: sb,
    });
  }

  function clearFilters() {
    setRarity('');
    setType('');
    setSetName('');
    setSortBy('newest');
    onFilterChange({ sortBy: 'newest' });
  }

  return (
    <div className="rounded-xl p-4 mb-6" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Rarity</label>
          <select value={rarity} onChange={(e) => handleChange(e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {RARITIES.map((r) => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Type</label>
          <select value={type} onChange={(e) => handleChange(undefined, e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Set</label>
          <select value={setName} onChange={(e) => handleChange(undefined, undefined, e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {SETS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Sort By</label>
          <select value={sortBy} onChange={(e) => handleChange(undefined, undefined, undefined, e.target.value as CollectionFilters['sortBy'])} style={selectStyle}>
            {SORT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="text-sm hover:underline cursor-pointer"
          style={{ color: '#60A5FA' }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
