'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/packs');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a15' }}>
      <Navbar user={null} coins={0} />
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-xl p-8" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <h1 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h1>

          {error && (
            <div className="rounded-lg mb-4 px-4 py-3 text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#94a3b8' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: '#94a3b8' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#94a3b8' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition-all disabled:opacity-40 cursor-pointer hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #E3350D, #c62d0a)', boxShadow: '0 4px 16px rgba(227,53,13,0.3)' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4" style={{ color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#60A5FA' }}>
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
