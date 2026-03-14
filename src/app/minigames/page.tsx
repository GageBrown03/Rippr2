import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minigames - Pokémon Pack Opener',
  description: 'Play minigames to earn credits and test your Pokémon knowledge!',
};

export default function MinigamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎮 Minigames
            </h1>
            <p className="text-lg text-gray-600">
              Test your knowledge and earn credits!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Silhouette Game Card */}
            <Link href="/minigames/silhouette">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-8 text-white">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    🔍
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Who's That Silhouette?
                  </h2>
                  <p className="text-purple-100">
                    Identify Pokémon from their silhouettes
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• View a blacked-out Pokémon silhouette</li>
                      <li>• Choose the correct name from 4 options</li>
                      <li>• Answer within 10 seconds</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Rewards:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>⚡ 0-3 seconds: <span className="font-bold text-green-600">100 Credits</span></li>
                      <li>🏃 3-7 seconds: <span className="font-bold text-yellow-600">50 Credits</span></li>
                      <li>🚶 7-10 seconds: <span className="font-bold text-orange-600">10 Credits</span></li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <div className="bg-blue-600 text-white text-center py-3 rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
                      Play Now →
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Guess That Pokémon Game Card */}
            <Link href="/minigames/guess">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 text-white">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    🎯
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Guess That Pokémon!
                  </h2>
                  <p className="text-green-100">
                    Identify Pokémon from their images
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• View a Pokémon card image</li>
                      <li>• Choose the correct name from 4 options</li>
                      <li>• Answer within 10 seconds</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Rewards:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>⚡ 0-3 seconds: <span className="font-bold text-green-600">100 Credits</span></li>
                      <li>🏃 3-7 seconds: <span className="font-bold text-yellow-600">50 Credits</span></li>
                      <li>🚶 7-10 seconds: <span className="font-bold text-orange-600">10 Credits</span></li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <div className="bg-green-600 text-white text-center py-3 rounded-lg font-semibold group-hover:bg-green-700 transition-colors">
                      Play Now →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
