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

          {/* Vault rewards info */}
          <div className="rounded-xl p-4 mb-8 flex flex-wrap gap-6 items-center justify-center"
            style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-semibold" style={{ color: '#64748b' }}>Vault Rewards per Set:</span>
            <span className="text-sm font-bold" style={{ color: '#FACC15' }}>🪙 5,000</span>
            <span className="text-sm font-bold" style={{ color: '#C4B5FD' }}>✨ 500 Stardust</span>
            <span className="text-sm font-bold" style={{ color: '#4ADE80' }}>⚡ 2 Delta Energy</span>
            <span className="text-sm font-bold" style={{ color: '#FB923C' }}>+ Exclusive Card</span>
          </div>

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
                        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
                        <div className="text-3xl">🏆</div>
                        <div>
                          <h3 className="text-white font-bold">{s.packName}</h3>
                          <p className="text-xs" style={{ color: '#FACC15' }}>{s.totalCards}/{s.totalCards} · Complete!</p>
                        </div>
                        <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: 'rgba(234,179,8,0.2)', color: '#FACC15' }}>
                          VAULTED
                        </span>
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
      </div>
    </ErrorBoundary>
  );
}
