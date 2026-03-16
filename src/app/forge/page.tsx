'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import Image from 'next/image';
import type { User, UserCardWithCard, Pack } from '@/types';

const DUST_VALUES: Record<string, number> = { Common: 5, Uncommon: 10, Rare: 20, 'Holo Rare': 50, 'Ultra Rare': 100 };
const CRAFT_COSTS: Record<string, number> = { Common: 10, Uncommon: 25, Rare: 60, 'Holo Rare': 150, 'Ultra Rare': 400 };
const FORGE_COST = 200;

const RARITY_COLORS: Record<string, string> = {
  Common: '#9CA3AF', Uncommon: '#4ADE80', Rare: '#60A5FA', 'Holo Rare': '#C084FC', 'Ultra Rare': '#FACC15',
};

type Tab = 'dust' | 'craft' | 'forge';

export default function ForgePage() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('dust');
  const [userCards, setUserCards] = useState<UserCardWithCard[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [acting, setActing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, collRes, packsRes] = await Promise.all([
        fetch('/api/auth/me'), fetch('/api/collection?limit=500&sortBy=rarest'), fetch('/api/packs'),
      ]);
      const [userData, collData, packsData] = await Promise.all([userRes.json(), collRes.json(), packsRes.json()]);
      if (userData.success) setUser(userData.data);
      if (collData.success) setUserCards(collData.data);
      if (packsData.success) {
        setPacks(packsData.data);
        // Flatten all cards from packs for craft tab
        const cards: any[] = [];
        for (const pack of packsData.data) {
          const res = await fetch(`/api/packs`); // We'll use collection API differently
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAllByRarity(rarity: string) {
    const ids = userCards.filter((uc) => uc.card.rarity === rarity && !uc.showcase).map((uc) => uc.id);
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  const selectedCards = userCards.filter((uc) => selected.has(uc.id));
  const totalDust = selectedCards.reduce((sum, uc) => sum + (DUST_VALUES[uc.card.rarity] || 5), 0);

  async function handleDust() {
    if (acting || selected.size === 0) return;
    setActing(true); setActionMsg('');
    try {
      const res = await fetch('/api/forge/dust', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCardIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Dusted ${data.data.cardsDusted} cards → ✨ ${data.data.stardustEarned} Stardust`);
        setUser((prev) => prev ? { ...prev, stardustBalance: data.data.newStardustBalance } : null);
        setSelected(new Set());
        fetchData();
      } else { setActionMsg(data.error || 'Failed'); }
    } catch { setActionMsg('Failed to dust cards'); }
    finally { setActing(false); setTimeout(() => setActionMsg(''), 4000); }
  }

  async function handleCraft(cardId: string, cardName: string, rarity: string) {
    if (acting) return;
    setActing(true); setActionMsg('');
    try {
      const res = await fetch('/api/forge/craft', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Crafted ${data.data.cardName} for ✨ ${data.data.stardustSpent}`);
        setUser((prev) => prev ? { ...prev, stardustBalance: data.data.newStardustBalance } : null);
        fetchData();
      } else { setActionMsg(data.error || 'Failed'); }
    } catch { setActionMsg('Failed to craft'); }
    finally { setActing(false); setTimeout(() => setActionMsg(''), 4000); }
  }

  async function handleForgePack(packId: string) {
    if (acting) return;
    setActing(true); setActionMsg('');
    try {
      const res = await fetch('/api/forge/premium-pack', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Forged ${data.data.packName} pack → ${data.data.cards.length} cards!`);
        setUser((prev) => prev ? { ...prev, stardustBalance: data.data.newStardustBalance } : null);
        fetchData();
      } else { setActionMsg(data.error || 'Failed'); }
    } catch { setActionMsg('Failed to forge pack'); }
    finally { setActing(false); setTimeout(() => setActionMsg(''), 4000); }
  }

  async function handleGrade(userCardId: string) {
    if (acting) return;
    setActing(true); setActionMsg('');
    try {
      const res = await fetch('/api/cards/grade', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCardId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`${data.data.cardName} graded: ${data.data.grade}/10!`);
        setUser((prev) => prev ? { ...prev, stardustBalance: data.data.newStardustBalance } : null);
        fetchData();
      } else { setActionMsg(data.error || 'Failed'); }
    } catch { setActionMsg('Failed to grade'); }
    finally { setActing(false); setTimeout(() => setActionMsg(''), 4000); }
  }

  // Get unique cards from user's collection for "craft browse"
  const uniqueOwnedCards = new Map<string, UserCardWithCard>();
  userCards.forEach((uc) => { if (!uniqueOwnedCards.has(uc.cardId)) uniqueOwnedCards.set(uc.cardId, uc); });

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: '#0a0a15' }}>
        <Navbar user={user} coins={user?.coins ?? 0} stardust={user?.stardustBalance} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white">⚒️ The Forge</h1>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>Dust cards for Stardust · Craft cards · Grade your collection</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.3)' }}>
                ✨ {(user?.stardustBalance ?? 0).toLocaleString()} Stardust
              </span>
              <span className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)' }}>
                ⚡ {user?.deltaEnergy ?? 0} Delta Energy
              </span>
            </div>
          </div>

          {actionMsg && (
            <div className="rounded-lg mb-4 px-4 py-3 text-sm font-medium" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ADE80' }}>
              {actionMsg}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['dust', 'craft', 'forge'] as Tab[]).map((t) => (
              <button key={t} onClick={() => { setTab(t); setSelected(new Set()); }}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer capitalize"
                style={tab === t
                  ? { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t === 'dust' ? '🔥 Dust Cards' : t === 'craft' ? '🔨 Craft & Grade' : '📦 Forge Pack'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16" style={{ color: '#64748b' }}>Loading...</div>
          ) : tab === 'dust' ? (
            /* ═══ DUST TAB ═══ */
            <div>
              {/* Quick select */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-semibold self-center" style={{ color: '#64748b' }}>Select all:</span>
                {['Common', 'Uncommon', 'Rare'].map((r) => (
                  <button key={r} onClick={() => selectAllByRarity(r)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: `${RARITY_COLORS[r]}15`, color: RARITY_COLORS[r], border: `1px solid ${RARITY_COLORS[r]}40` }}>
                    {r}
                  </button>
                ))}
                {selected.size > 0 && (
                  <button onClick={() => setSelected(new Set())}
                    className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer" style={{ color: '#EF4444' }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Dust summary bar */}
              {selected.size > 0 && (
                <div className="rounded-xl p-4 mb-4 flex items-center justify-between flex-wrap gap-3"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <div>
                    <span className="text-white font-bold">{selected.size} cards selected</span>
                    <span className="ml-3 font-bold" style={{ color: '#C4B5FD' }}>→ ✨ {totalDust} Stardust</span>
                  </div>
                  <button onClick={handleDust} disabled={acting}
                    className="px-6 py-2 rounded-lg font-bold text-white transition-all hover:scale-105 cursor-pointer disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}>
                    🔥 Dust {selected.size} Cards
                  </button>
                </div>
              )}

              {/* Card grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {userCards.filter((uc) => !uc.showcase).map((uc) => {
                  const isSelected = selected.has(uc.id);
                  const rc = RARITY_COLORS[uc.card.rarity] || '#9CA3AF';
                  const dustVal = DUST_VALUES[uc.card.rarity] || 5;
                  return (
                    <div key={uc.id} onClick={() => toggleSelect(uc.id)}
                      className="rounded-xl p-2 cursor-pointer transition-all hover:scale-[1.03]"
                      style={{
                        background: isSelected ? 'rgba(139,92,246,0.2)' : '#1a1f2e',
                        border: isSelected ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.06)',
                        boxShadow: isSelected ? '0 0 16px rgba(139,92,246,0.3)' : 'none',
                      }}>
                      {uc.card.imageUrl && (
                        <div className="relative w-full aspect-[3/4] mb-1.5 rounded-lg overflow-hidden">
                          <Image src={uc.card.imageUrl} alt={uc.card.name} fill className="object-contain" unoptimized />
                        </div>
                      )}
                      <h4 className="font-bold text-[10px] truncate text-white">{uc.card.name}</h4>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[9px] font-semibold" style={{ color: rc }}>{uc.card.rarity}</span>
                        <span className="text-[9px] font-bold" style={{ color: '#C4B5FD' }}>✨{dustVal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : tab === 'craft' ? (
            /* ═══ CRAFT & GRADE TAB ═══ */
            <div>
              <p className="text-xs mb-4" style={{ color: '#64748b' }}>
                Grade ungraded cards (✨25) or browse your collection. Grading is permanent.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userCards.map((uc) => {
                  const rc = RARITY_COLORS[uc.card.rarity] || '#9CA3AF';
                  return (
                    <div key={uc.id} className="rounded-xl p-3 relative"
                      style={{ background: '#1a1f2e', border: `2px solid ${rc}40` }}>
                      {/* Grade badge */}
                      {uc.grade !== null && (
                        <div className="absolute top-1 right-1 z-10 px-2 py-0.5 rounded-md text-[10px] font-black"
                          style={{
                            background: uc.grade >= 9 ? 'linear-gradient(135deg, #EAB308, #F59E0B)' : uc.grade >= 7 ? '#3B82F6' : '#6B7280',
                            color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          }}>
                          {uc.grade >= 10 ? 'GEM 10' : `PSA ${uc.grade}`}
                        </div>
                      )}
                      {/* Delta badge */}
                      {uc.deltaType && (
                        <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                          style={{ background: 'rgba(0,0,0,0.7)', color: RARITY_COLORS['Holo Rare'] }}>
                          δ {uc.deltaType}
                        </div>
                      )}
                      {uc.card.imageUrl && (
                        <div className="relative w-full aspect-[3/4] mb-2 rounded-lg overflow-hidden">
                          <Image src={uc.card.imageUrl} alt={uc.card.name} fill className="object-contain" unoptimized />
                        </div>
                      )}
                      <h4 className="font-bold text-xs truncate text-white">{uc.card.name}</h4>
                      <p className="text-[10px] font-semibold" style={{ color: rc }}>{uc.card.rarity}</p>
                      {uc.grade === null && (
                        <button onClick={() => handleGrade(uc.id)} disabled={acting || (user?.stardustBalance ?? 0) < 25}
                          className="w-full mt-2 px-2 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ background: 'rgba(139,92,246,0.15)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.3)' }}>
                          Grade · ✨25
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ═══ FORGE PACK TAB ═══ */
            <div>
              <p className="text-xs mb-4" style={{ color: '#64748b' }}>
                Spend ✨{FORGE_COST} Stardust to forge a pack from any set.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packs.map((pack) => (
                  <div key={pack.id} className="rounded-xl p-4 flex items-center gap-4"
                    style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-4xl">📦</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">{pack.name}</h3>
                      <p className="text-[10px]" style={{ color: '#64748b' }}>{pack.cardsPerPack} cards · ✨{FORGE_COST} Stardust</p>
                    </div>
                    <button onClick={() => handleForgePack(pack.id)}
                      disabled={acting || (user?.stardustBalance ?? 0) < FORGE_COST}
                      className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff' }}>
                      Forge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
