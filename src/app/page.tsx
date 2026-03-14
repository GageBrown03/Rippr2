import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar user={null} coins={0} />
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-pokered mb-4">
            Pokémon Pack Opener
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Open virtual Pokémon card packs, build your collection, and showcase
            your rarest pulls. Earn PokéCoins daily and hunt for Ultra Rares!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🎴</div>
            <h3 className="text-xl font-bold mb-2">Open Packs</h3>
            <p className="text-gray-600">
              Choose from 5 different sets and open up to 10 packs at once!
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Collect Cards</h3>
            <p className="text-gray-600">
              Build your collection with Common to Ultra Rare cards across all sets.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Showcase Pulls</h3>
            <p className="text-gray-600">
              Show off your best 12 cards with AI-generated flavor text!
            </p>
          </div>
        </section>

        {/* Rarity Info */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Rarity Tiers</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="card-common px-4 py-2 rounded-lg font-semibold">Common</span>
            <span className="card-uncommon px-4 py-2 rounded-lg font-semibold">Uncommon</span>
            <span className="card-rare px-4 py-2 rounded-lg font-semibold">Rare</span>
            <span className="card-holo-rare px-4 py-2 rounded-lg font-semibold">Holo Rare</span>
            <span className="card-ultra-rare px-4 py-2 rounded-lg font-semibold">Ultra Rare</span>
          </div>
        </section>
      </main>
    </div>
  );
}
