import type { Metadata } from 'next';
import GuessGame from '@/components/GuessGame';

export const metadata: Metadata = {
  title: 'Guess That Pokémon - Pokémon Pack Opener',
  description: 'Guess the Pokémon from its image and earn credits!',
};

export default function GuessGamePage() {
  return <GuessGame />;
}