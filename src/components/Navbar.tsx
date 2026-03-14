'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

export type NavbarProps = {
  user: User | null;
  coins: number;
};

export default function Navbar({ user, coins }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <nav className="bg-pokered text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          🎴 PokéPacks
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/packs" className="hover:text-pokeyellow transition-colors font-semibold">
                Packs
              </Link>
              <Link href="/collection" className="hover:text-pokeyellow transition-colors font-semibold">
                Collection
              </Link>
              <span className="bg-pokeyellow text-black px-3 py-1 rounded-full font-bold text-sm">
                🪙 {coins.toLocaleString()}
              </span>
              <span className="text-sm opacity-90">{user.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm hover:text-pokeyellow transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-pokeyellow transition-colors font-semibold">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-pokeyellow text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
