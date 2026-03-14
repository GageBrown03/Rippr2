import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokémon Pack Opener',
  description: 'Open Pokémon card packs, build your collection, and showcase your best pulls!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {children}
      </body>
    </html>
  );
}
