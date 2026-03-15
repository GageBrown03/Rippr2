import { Metadata } from 'next';
import Link from 'next/link';
import SilhouetteGame from '@/components/SilhouetteGame';

export const metadata: Metadata = {
  title: "Who's That Silhouette? - PokéPacks",
  description: 'Test your Pokémon knowledge and earn credits by identifying silhouettes!',
};

export default function SilhouettePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a15' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">
            🔍 Who&apos;s That Silhouette?
          </h1>
          <p style={{ color: '#94a3b8' }}>
            Identify the Pokémon and earn credits based on your speed!
          </p>
        </div>

        <div className="mb-8">
          <SilhouetteGame />
        </div>

        <div className="text-center">
          <Link
            href="/minigames"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            ← Back to Minigames
          </Link>
        </div>

        <div className="mt-12 rounded-xl p-6" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-xl font-bold text-white mb-4">How to Play</h2>
          <div className="space-y-4" style={{ color: '#94a3b8' }}>
            <p className="text-sm">
              A Pokémon card appears as a black silhouette. You have 10 seconds to pick the correct name from 4 options.
              The faster you answer, the more credits you earn!
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>⚡ 0-3s: <span style={{ color: '#4ADE80' }} className="font-bold">100 coins</span></span>
              <span>🏃 3-7s: <span style={{ color: '#FACC15' }} className="font-bold">50 coins</span></span>
              <span>🚶 7-10s: <span style={{ color: '#FB923C' }} className="font-bold">10 coins</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
