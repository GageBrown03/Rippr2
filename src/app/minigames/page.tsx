import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minigames - PokéPacks',
  description: 'Play minigames to earn coins and test your Pokémon knowledge!',
};

export default function MinigamesPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a15' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 Minigames</h1>
          <p style={{ color: '#94a3b8' }}>Test your knowledge and earn coins!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Silhouette Game */}
          <Link href="/minigames/silhouette">
            <div className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
              style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="p-8" style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                <h2 className="text-2xl font-bold text-white mb-1">Who&apos;s That Silhouette?</h2>
                <p className="text-white/70 text-sm">Identify Pokémon from their silhouettes</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-sm mb-2">How to Play:</h3>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>
                    View a blacked-out Pokémon silhouette, choose the correct name from 4 options within 10 seconds.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-sm mb-2">Rewards:</h3>
                  <div className="flex gap-3 text-xs" style={{ color: '#94a3b8' }}>
                    <span>⚡ Fast: <span style={{ color: '#4ADE80' }} className="font-bold">100</span></span>
                    <span>🏃 Mid: <span style={{ color: '#FACC15' }} className="font-bold">50</span></span>
                    <span>🚶 Slow: <span style={{ color: '#FB923C' }} className="font-bold">10</span></span>
                  </div>
                </div>
                <div className="py-3 rounded-lg font-semibold text-center text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                >
                  Play Now →
                </div>
              </div>
            </div>
          </Link>

          {/* Guess Game */}
          <Link href="/minigames/guess">
            <div className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
              style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="p-8" style={{ background: 'linear-gradient(135deg, #059669, #0D9488)' }}>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                <h2 className="text-2xl font-bold text-white mb-1">Guess That Pokémon!</h2>
                <p className="text-white/70 text-sm">Identify Pokémon from their card images</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-sm mb-2">How to Play:</h3>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>
                    View a Pokémon card image, choose the correct name from 4 options within 15 seconds.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-sm mb-2">Reward:</h3>
                  <div className="text-sm">
                    <span style={{ color: '#FACC15' }} className="font-bold text-lg">🪙 1,000 coins</span>
                    <span style={{ color: '#94a3b8' }} className="ml-2 text-xs">per correct answer</span>
                  </div>
                </div>
                <div className="py-3 rounded-lg font-semibold text-center text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #059669, #0D9488)' }}
                >
                  Play Now →
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/packs"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            ← Back to Packs
          </Link>
        </div>
      </div>
    </div>
  );
}
