import { Metadata } from 'next';
import Link from 'next/link';
import SilhouetteGame from '@/components/SilhouetteGame';

export const metadata: Metadata = {
  title: "Who's That Silhouette? - Pokémon Pack Opener",
  description: 'Test your Pokémon knowledge and earn credits by identifying silhouettes!',
};

export default function SilhouettePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🔍 Who's That Silhouette?
            </h1>
            <p className="text-lg text-gray-600">
              Identify the Pokémon and earn credits based on your speed!
            </p>
          </div>

          {/* Game Component */}
          <div className="mb-8">
            <SilhouetteGame />
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/minigames"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Minigames
            </Link>
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">📋 Rules:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>A Pokémon card will appear as a black silhouette</li>
                  <li>You have 10 seconds to identify it</li>
                  <li>Choose from 4 multiple-choice options</li>
                  <li>The faster you answer correctly, the more credits you earn!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">💰 Credit Rewards:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-bold text-green-600">100 Credits</span> - Answer in 0-3 seconds (Lightning fast!)</li>
                  <li><span className="font-bold text-yellow-600">50 Credits</span> - Answer in 3-7 seconds (Quick thinking!)</li>
                  <li><span className="font-bold text-orange-600">10 Credits</span> - Answer in 7-10 seconds (Made it!)</li>
                  <li><span className="font-bold text-gray-600">0 Credits</span> - Wrong answer or time's up</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">💡 Tips:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Study the shape carefully - look for distinctive features</li>
                  <li>Rare and Illustration Rare cards appear more often</li>
                  <li>Build your collection to become more familiar with the cards</li>
                  <li>Practice makes perfect - play multiple rounds to improve!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}