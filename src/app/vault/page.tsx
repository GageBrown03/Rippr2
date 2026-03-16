'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { User } from '@/types';

interface SetProgress {
  packId: string;
  setName: string;
  packName: string;
  totalCards: number;
  ownedCount: number;
  percentage: number;
  isComplete: boolean;
  isVaulted: boolean;
  isPrestiged: boolean;
  missingCards: { id: string; name: string; rarity: string }[];
}

const RARITY_COLORS: Record<string, string> = {
  Common: '#9CA3AF', Uncommon: '#4ADE80', Rare: '#60A5FA', 'Holo Rare': '#C084FC', 'Ultra Rare': '#FACC15',
};

export default function VaultPage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<SetProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [vaulting, setVaulting] = useState(false);
  const [msg, setMsg] = useState('');
  const [expandedSet, setExpandedSet] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, vaultRes] = await Promise.all([
        fetch('/api/auth/me'), fetch('/api/vault/check'),
      ]);
      const [userData, vaultData] = await Promise.all([userRes.json(), vaultRes.json()]);
      if (userData.success) setUser(userData.data);
      if (vaultData.success) setProgress(vaultData.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleVault(setName: string) {
    if (vaulting) return;
    setVaulting(true); setMsg('');
    try {
      const res = await fetch('/api/vault/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setName }),
      });
      const data = await res.json();
      if (data.success) {
        const r = data.data.rewards;
        setMsg(`🏆 ${setName} vaulted! Earned 🪙${r.coins} + ✨${r.stardust} + ⚡${r.deltaEnergy} Delta Energy${data.data.rewardCard ? ` + Exclusive card: ${data.data.rewardCard.cardName}` : ''}`);
        setUser((prev) => prev ? {
          ...prev,
          coins: data.data.newCoins,
          stardustBalance: data.data.newStardustBalance,
          deltaEnergy: data.data.newDeltaEnergy,
        } : null);
        fetchData();
      } else { setMsg(data.error || 'Failed to vault'); }
    } catch { setMsg('Failed to vault set'); }
    finally { setVaulting(false); setTimeout(() => setMsg(''), 6000); }
  }

  const [prestigeTarget, setPrestigeTarget] = useState<string | null>(null);

  async function handlePrestige(setName: string) {
    if (vaulting) return;
    setVaulting(true); setMsg(''); setPrestigeTarget(null);
    try {
      const res = await fetch('/api/vault/prestige', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setName }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`⭐ ${setName} PRESTIGED! Wiped ${data.data.cardsWiped} cards. Luck +${(data.data.newLuckModifier * 100).toFixed(0)}% · +✨${data.data.bonusStardust} Stardust`);
        setUser((prev) => prev ? {
          ...prev,
          stardustBalance: data.data.newStardustBalance,
          luckModifier: data.data.newLuckModifier,
          prestigedSets: [...(prev.prestigedSets || []), setName],
        } : null);
        fetchData();
      } else { setMsg(data.error || 'Failed to prestige'); }
    } catch { setMsg('Failed to prestige set'); }
    finally { setVaulting(false); setTimeout(() => setMsg(''), 6000); }
  }

  const vaultedSets = progress.filter((s) => s.isVaulted);
  const activeSets = progress.filter((s) => !s.isVaulted);

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: '#0a0a15' }}>
        <Navbar user={user} coins={user?.coins ?? 0} stardust={user?.stardustBalance} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">🏛️ The Vault</h1>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Collect every card in a set to vault it. Earn massive rewards + exclusive cards.
            </p>
          </div>

          {msg && (
            <div className="rounded-lg mb-6 px-4 py-3 text-sm font-medium"
              style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#FACC15' }}>
              {msg}
            </div>
          )}

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-4 flex flex-wrap gap-4 items-center justify-center"
              style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xs font-semibold" style={{ color: '#64748b' }}>Vault Rewards:</span>
              <span className="text-sm font-bold" style={{ color: '#FACC15' }}>🪙 5,000</span>
              <span className="text-sm font-bold" style={{ color: '#C4B5FD' }}>✨ 500</span>
              <span className="text-sm font-bold" style={{ color: '#4ADE80' }}>⚡ 2</span>
              <span className="text-sm font-bold" style={{ color: '#FB923C' }}>+ Exclusive</span>
            </div>
            <div className="rounded-xl p-4 flex flex-wrap gap-4 items-center justify-center"
              style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xs font-semibold" style={{ color: '#64748b' }}>Prestige Rewards:</span>
              <span className="text-sm font-bold" style={{ color: '#FB923C' }}>+5% Luck</span>
              <span className="text-sm font-bold" style={{ color: '#C4B5FD' }}>✨ 1,000</span>
              <span className="text-sm font-bold" style={{ color: '#EF4444' }}>⚠️ Wipes cards</span>
            </div>
          </div>

          {/* Luck modifier display */}
          {(user?.luckModifier ?? 0) > 0 && (
            <div className="rounded-xl p-3 mb-6 text-center"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)' }}>
              <span className="text-sm font-bold" style={{ color: '#FB923C' }}>
                🍀 Luck Modifier: +{((user?.luckModifier ?? 0) * 100).toFixed(0)}% rare pull boost
              </span>
              <span className="text-xs ml-2" style={{ color: '#64748b' }}>
                ({(user?.prestigedSets?.length ?? 0)} set{(user?.prestigedSets?.length ?? 0) !== 1 ? 's' : ''} prestiged)
              </span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16" style={{ color: '#64748b' }}>Loading vault progress...</div>
          ) : (
            <>
              {/* Vaulted sets */}
              {vaultedSets.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-white mb-4">🏆 Vaulted Sets</h2>
                  <div className="grid gap-3">
                    {vaultedSets.map((s) => (
                      <div key={s.packId} className="rounded-xl p-4 flex items-center gap-4"
                        style={{
                          background: s.isPrestiged ? 'rgba(251,146,60,0.08)' : 'rgba(234,179,8,0.08)',
                          border: `1px solid ${s.isPrestiged ? 'rgba(251,146,60,0.3)' : 'rgba(234,179,8,0.25)'}`,
                        }}>
                        <div className="text-3xl">{s.isPrestiged ? '⭐' : '🏆'}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold">{s.packName}</h3>
                          <p className="text-xs" style={{ color: s.isPrestiged ? '#FB923C' : '#FACC15' }}>
                            {s.isPrestiged ? 'Prestiged · +5% Luck' : `${s.totalCards}/${s.totalCards} · Complete!`}
                          </p>
                        </div>
                        {s.isPrestiged ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(251,146,60,0.2)', color: '#FB923C' }}>
                            ⭐ PRESTIGED
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background: 'rgba(234,179,8,0.2)', color: '#FACC15' }}>
                              VAULTED
                            </span>
                            <button onClick={() => setPrestigeTarget(s.setName)}
                              disabled={vaulting}
                              className="px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 disabled:opacity-40"
                              style={{ background: 'rgba(251,146,60,0.2)', color: '#FB923C', border: '1px solid rgba(251,146,60,0.3)' }}>
                              ⭐ Prestige
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active sets */}
              <h2 className="text-lg font-bold text-white mb-4">📊 Set Progress</h2>
              <div className="grid gap-4">
                {activeSets.map((s) => (
                  <div key={s.packId} className="rounded-xl overflow-hidden"
                    style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-sm">{s.packName}</h3>
                          <p className="text-xs" style={{ color: '#64748b' }}>{s.setName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold" style={{ color: s.isComplete ? '#4ADE80' : '#94a3b8' }}>
                            {s.ownedCount} / {s.totalCards}
                          </span>
                          {s.isComplete ? (
                            <button onClick={() => handleVault(s.setName)} disabled={vaulting}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-105 disabled:opacity-40"
                              style={{ background: 'linear-gradient(135deg, #EAB308, #F59E0B)', color: '#000', boxShadow: '0 4px 16px rgba(234,179,8,0.3)' }}>
                              🏛️ Vault Set
                            </button>
                          ) : (
                            <button onClick={() => setExpandedSet(expandedSet === s.packId ? null : s.packId)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer"
                              style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                              {expandedSet === s.packId ? 'Hide' : 'Missing'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${s.percentage}%`,
                            background: s.percentage === 100
                              ? 'linear-gradient(90deg, #EAB308, #F59E0B)'
                              : s.percentage > 75 ? 'linear-gradient(90deg, #6366F1, #8B5CF6)'
                              : s.percentage > 50 ? '#3B82F6'
                              : s.percentage > 25 ? '#22C55E'
                              : '#6B7280',
                          }} />
                      </div>
                      <p className="text-right text-[10px] mt-1 font-bold" style={{ color: '#64748b' }}>{s.percentage}%</p>
                    </div>

                    {/* Missing cards dropdown */}
                    {expandedSet === s.packId && s.missingCards.length > 0 && (
                      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#64748b' }}>Missing cards:</p>
                        <div className="flex flex-wrap gap-2">
                          {s.missingCards.map((c) => (
                            <span key={c.id} className="px-2 py-1 rounded text-[10px] font-semibold"
                              style={{ background: `${RARITY_COLORS[c.rarity] || '#9CA3AF'}15`, color: RARITY_COLORS[c.rarity] || '#9CA3AF', border: `1px solid ${RARITY_COLORS[c.rarity] || '#9CA3AF'}30` }}>
                              {c.name}
                            </span>
                          ))}
                          {s.totalCards - s.ownedCount > 10 && (
                            <span className="text-[10px] self-center" style={{ color: '#64748b' }}>
                              ...and {s.totalCards - s.ownedCount - s.missingCards.length} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Prestige Confirmation Dialog */}
        {prestigeTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
            <div className="rounded-2xl p-6 max-w-md mx-4 text-center" style={{ background: '#1a1f2e', border: '1px solid rgba(251,146,60,0.3)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-white mb-2">Prestige {prestigeTarget}?</h3>
              <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
                This will <span className="font-bold text-red-400">permanently wipe</span> all non-showcased cards from this set.
              </p>
              <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-bold mb-2 text-white">You will receive:</p>
                <div className="flex justify-center gap-4 text-sm">
                  <span style={{ color: '#FB923C' }} className="font-bold">+5% Luck</span>
                  <span style={{ color: '#C4B5FD' }} className="font-bold">✨ 1,000</span>
                  <span style={{ color: '#FACC15' }} className="font-bold">⭐ Badge</span>
                </div>
              </div>
              <p className="text-xs mb-6" style={{ color: '#EF4444' }}>
                This action cannot be undone. Showcased cards are safe.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setPrestigeTarget(null)}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Cancel
                </button>
                <button onClick={() => handlePrestige(prestigeTarget)}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #EA580C, #C2410C)', color: '#fff', boxShadow: '0 4px 16px rgba(234,88,12,0.3)' }}>
                  ⭐ Prestige Set
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
