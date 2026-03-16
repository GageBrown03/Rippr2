'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

export type NavbarProps = {
  user: User | null;
  coins: number;
  stardust?: number;
};

export default function Navbar({ user, coins, stardust }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <nav style={{ background: '#E3350D', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight">
          🎴 PokéPacks
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          {user ? (
            <>
              <Link href="/packs" className="hover:text-pokeyellow transition-colors font-semibold text-xs sm:text-sm">
                Packs
              </Link>
              <Link href="/collection" className="hover:text-pokeyellow transition-colors font-semibold text-xs sm:text-sm">
                Collection
              </Link>
              <Link href="/forge" className="hover:text-pokeyellow transition-colors font-semibold text-xs sm:text-sm">
                Forge
              </Link>
              <Link href="/vault" className="hover:text-pokeyellow transition-colors font-semibold text-xs sm:text-sm">
                Vault
              </Link>
              <Link href="/minigames" className="hover:text-pokeyellow transition-colors font-semibold text-xs sm:text-sm">
                Games
              </Link>
              <div className="flex items-center gap-2">
                <span className="bg-pokeyellow text-black px-2 py-0.5 rounded-full font-bold text-xs">
                  🪙 {coins.toLocaleString()}
                </span>
                {stardust !== undefined && (
                  <span className="px-2 py-0.5 rounded-full font-bold text-xs" style={{ background: 'rgba(139,92,246,0.3)', color: '#C4B5FD' }}>
                    ✨ {stardust.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-xs opacity-90 hidden sm:inline">{user.username}</span>
              <button onClick={handleLogout}
                className="text-xs hover:text-pokeyellow transition-colors cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-pokeyellow transition-colors font-semibold">Sign In</Link>
              <Link href="/register" className="bg-pokeyellow text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
