import Link from 'next/link';
import Navbar from '@/components/Navbar';

const FEATURED_CARDS = [
  { name: 'Charizard', set: 'Base Set', img: 'https://images.pokemontcg.io/base1/4_hires.png' },
  { name: 'Dark Charizard', set: 'Team Rocket', img: 'https://images.pokemontcg.io/base4/4_hires.png' },
  { name: 'Lapras', set: 'Fossil', img: 'https://images.pokemontcg.io/base3/10_hires.png' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a15' }}>
      <Navbar user={null} coins={0} />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero */}
        <section className="text-center mb-16 sm:mb-20">
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-4 tracking-tight"
            style={{ color: '#E3350D', textShadow: '0 0 40px rgba(227,53,13,0.3)' }}
          >
            PokéPacks
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8" style={{ color: '#94a3b8' }}>
            Open virtual Pokémon card packs, build your collection, and showcase
            your rarest pulls. Earn PokéCoins daily and hunt for Ultra Rares!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="px-8 py-3 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #E3350D, #c62d0a)', boxShadow: '0 4px 24px rgba(227,53,13,0.35)' }}
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Featured cards showcase */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-center text-sm font-semibold tracking-[0.2em] uppercase mb-8" style={{ color: '#64748b' }}>
            Chase Cards
          </h2>
          <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
            {FEATURED_CARDS.map((card) => (
              <div key={card.name} className="group relative">
                <div
                  className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2"
                  style={{
                    border: '2px solid rgba(234,179,8,0.4)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(234,179,8,0.15)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 py-2 px-2 text-center"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}
                  >
                    <span className="text-white text-xs font-bold drop-shadow">{card.name}</span>
                    <span className="block text-[10px]" style={{ color: '#94a3b8' }}>{card.set}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 mb-16 sm:mb-20">
          {[
            { icon: '🎴', title: 'Open Packs', desc: 'Choose from 5 different sets and open up to 10 packs at once!' },
            { icon: '⭐', title: 'Collect Cards', desc: 'Build your collection with Common to Ultra Rare cards across all sets.' },
            { icon: '🏆', title: 'Showcase Pulls', desc: 'Show off your best 12 cards with AI-generated flavor text!' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl p-6 text-center transition-all hover:scale-[1.02]"
              style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
              <p style={{ color: '#94a3b8' }} className="text-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Rarity tiers */}
        <section className="rounded-xl p-8 text-center" style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-xl font-bold mb-6 text-white">Rarity Tiers</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Common', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
              { name: 'Uncommon', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
              { name: 'Rare', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
              { name: 'Holo Rare', color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
              { name: 'Ultra Rare', color: '#EAB308', bg: 'rgba(234,179,8,0.1)' },
            ].map((r) => (
              <span
                key={r.name}
                className="px-4 py-2 rounded-lg font-semibold text-sm"
                style={{ color: r.color, background: r.bg, border: `1px solid ${r.color}33` }}
              >
                {r.name}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
