import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PACKS = [
  // ═══════════════════════════════════════════
  // 1. BASE SET — classic original set
  // ═══════════════════════════════════════════
  {
    name: 'Base Set',
    setName: 'Base Set',
    description: 'The original Pokémon TCG set that started it all in 1999!',
    cost: 200,
    imageUrl: 'https://images.pokemontcg.io/base1/logo.png',
    cards: [
      // Holo Rares (weight 0.01)
      { name: 'Alakazam', cardNumber: '1/102', rarity: 'Holo Rare', type: 'Psychic', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/1_hires.png', weight: 0.16 },
      { name: 'Blastoise', cardNumber: '2/102', rarity: 'Holo Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png', weight: 0.16 },
      { name: 'Chansey', cardNumber: '3/102', rarity: 'Holo Rare', type: 'Normal', hp: 120, imageUrl: 'https://images.pokemontcg.io/base1/3_hires.png', weight: 0.16 },
      { name: 'Clefairy', cardNumber: '5/102', rarity: 'Holo Rare', type: 'Normal', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/5_hires.png', weight: 0.16 },
      { name: 'Gyarados', cardNumber: '6/102', rarity: 'Holo Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/6_hires.png', weight: 0.16 },
      { name: 'Hitmonchan', cardNumber: '7/102', rarity: 'Holo Rare', type: 'Fighting', hp: 70, imageUrl: 'https://images.pokemontcg.io/base1/7_hires.png', weight: 0.16 },
      { name: 'Machamp', cardNumber: '8/102', rarity: 'Holo Rare', type: 'Fighting', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/8_hires.png', weight: 0.16 },
      { name: 'Magneton', cardNumber: '9/102', rarity: 'Holo Rare', type: 'Electric', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/9_hires.png', weight: 0.16 },
      { name: 'Mewtwo', cardNumber: '10/102', rarity: 'Holo Rare', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/10_hires.png', weight: 0.16 },
      { name: 'Nidoking', cardNumber: '11/102', rarity: 'Holo Rare', type: 'Grass', hp: 90, imageUrl: 'https://images.pokemontcg.io/base1/11_hires.png', weight: 0.16 },
      { name: 'Ninetales', cardNumber: '12/102', rarity: 'Holo Rare', type: 'Fire', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/12_hires.png', weight: 0.16 },
      { name: 'Poliwrath', cardNumber: '13/102', rarity: 'Holo Rare', type: 'Water', hp: 90, imageUrl: 'https://images.pokemontcg.io/base1/13_hires.png', weight: 0.16 },
      { name: 'Raichu', cardNumber: '14/102', rarity: 'Holo Rare', type: 'Electric', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/14_hires.png', weight: 0.16 },
      { name: 'Zapdos', cardNumber: '16/102', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/base1/16_hires.png', weight: 0.16 },
      // Rares
      { name: 'Beedrill', cardNumber: '17/102', rarity: 'Rare', type: 'Grass', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/17_hires.png', weight: 0.16 },
      { name: 'Dragonair', cardNumber: '18/102', rarity: 'Rare', type: 'Normal', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/18_hires.png', weight: 0.16 },
      { name: 'Dugtrio', cardNumber: '19/102', rarity: 'Rare', type: 'Fighting', hp: 70, imageUrl: 'https://images.pokemontcg.io/base1/19_hires.png', weight: 0.16 },
      { name: 'Electabuzz', cardNumber: '20/102', rarity: 'Rare', type: 'Electric', hp: 65, imageUrl: 'https://images.pokemontcg.io/base1/20_hires.png', weight: 0.16 },
      { name: 'Electrode', cardNumber: '21/102', rarity: 'Rare', type: 'Electric', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/21_hires.png', weight: 0.16 },
      { name: 'Pidgeotto', cardNumber: '22/102', rarity: 'Rare', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/22_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Charmeleon', cardNumber: '24/102', rarity: 'Uncommon', type: 'Fire', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/24_hires.png', weight: 0.25 },
      { name: 'Dewgong', cardNumber: '25/102', rarity: 'Uncommon', type: 'Water', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/25_hires.png', weight: 0.25 },
      { name: 'Haunter', cardNumber: '29/102', rarity: 'Uncommon', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/29_hires.png', weight: 0.25 },
      { name: 'Ivysaur', cardNumber: '30/102', rarity: 'Uncommon', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/30_hires.png', weight: 0.25 },
      { name: 'Kadabra', cardNumber: '32/102', rarity: 'Uncommon', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/32_hires.png', weight: 0.25 },
      { name: 'Wartortle', cardNumber: '42/102', rarity: 'Uncommon', type: 'Water', hp: 70, imageUrl: 'https://images.pokemontcg.io/base1/42_hires.png', weight: 0.25 },
      { name: 'Growlithe', cardNumber: '28/102', rarity: 'Uncommon', type: 'Fire', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/28_hires.png', weight: 0.25 },
      { name: 'Magikarp', cardNumber: '35/102', rarity: 'Uncommon', type: 'Water', hp: 30, imageUrl: 'https://images.pokemontcg.io/base1/35_hires.png', weight: 0.25 },
      // Commons
      { name: 'Bulbasaur', cardNumber: '44/102', rarity: 'Common', type: 'Grass', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/44_hires.png', weight: 1.0 },
      { name: 'Charmander', cardNumber: '46/102', rarity: 'Common', type: 'Fire', hp: 50, imageUrl: 'https://images.pokemontcg.io/base1/46_hires.png', weight: 1.0 },
      { name: 'Squirtle', cardNumber: '63/102', rarity: 'Common', type: 'Water', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/63_hires.png', weight: 1.0 },
      { name: 'Pikachu', cardNumber: '58/102', rarity: 'Common', type: 'Electric', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/58_hires.png', weight: 1.0 },
      { name: 'Gastly', cardNumber: '50/102', rarity: 'Common', type: 'Psychic', hp: 30, imageUrl: 'https://images.pokemontcg.io/base1/50_hires.png', weight: 1.0 },
      { name: 'Machop', cardNumber: '52/102', rarity: 'Common', type: 'Fighting', hp: 50, imageUrl: 'https://images.pokemontcg.io/base1/52_hires.png', weight: 1.0 },
      { name: 'Ponyta', cardNumber: '60/102', rarity: 'Common', type: 'Fire', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/60_hires.png', weight: 1.0 },
      { name: 'Rattata', cardNumber: '61/102', rarity: 'Common', type: 'Normal', hp: 30, imageUrl: 'https://images.pokemontcg.io/base1/61_hires.png', weight: 1.0 },
      { name: 'Sandshrew', cardNumber: '62/102', rarity: 'Common', type: 'Fighting', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/62_hires.png', weight: 1.0 },
      { name: 'Caterpie', cardNumber: '45/102', rarity: 'Common', type: 'Grass', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/45_hires.png', weight: 1.0 },
      { name: 'Diglett', cardNumber: '47/102', rarity: 'Common', type: 'Fighting', hp: 30, imageUrl: 'https://images.pokemontcg.io/base1/47_hires.png', weight: 1.0 },
      { name: 'Drowzee', cardNumber: '49/102', rarity: 'Common', type: 'Psychic', hp: 50, imageUrl: 'https://images.pokemontcg.io/base1/49_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Charizard (Vault 1st Edition)', cardNumber: 'VAULT/BS', rarity: 'Ultra Rare', type: 'Fire', hp: 120, imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 2. PREMIUM BASE SET — starter holos, higher odds
  // ═══════════════════════════════════════════
  {
    name: 'Premium Base Set',
    setName: 'Base Set',
    description: 'Premium pack featuring the Big 3 starters with boosted Holo pull rates!',
    cost: 500,
    imageUrl: 'https://images.pokemontcg.io/base1/logo.png',
    cards: [
      // Ultra Rares — the Big 3 (boosted 6x normal holo rate)
      { name: 'Charizard', cardNumber: '4/102', rarity: 'Ultra Rare', type: 'Fire', hp: 120, imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png', weight: 0.06 },
      { name: 'Blastoise', cardNumber: '2/102', rarity: 'Ultra Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png', weight: 0.06 },
      { name: 'Venusaur', cardNumber: '15/102', rarity: 'Ultra Rare', type: 'Grass', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/15_hires.png', weight: 0.06 },
      // Holo Rares — boosted (weight 0.05)
      { name: 'Mewtwo', cardNumber: '10/102', rarity: 'Holo Rare', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/10_hires.png', weight: 0.10 },
      { name: 'Gyarados', cardNumber: '6/102', rarity: 'Holo Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/6_hires.png', weight: 0.10 },
      { name: 'Alakazam', cardNumber: '1/102', rarity: 'Holo Rare', type: 'Psychic', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/1_hires.png', weight: 0.10 },
      { name: 'Zapdos', cardNumber: '16/102', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/base1/16_hires.png', weight: 0.10 },
      { name: 'Nidoking', cardNumber: '11/102', rarity: 'Holo Rare', type: 'Grass', hp: 90, imageUrl: 'https://images.pokemontcg.io/base1/11_hires.png', weight: 0.10 },
      { name: 'Raichu', cardNumber: '14/102', rarity: 'Holo Rare', type: 'Electric', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/14_hires.png', weight: 0.10 },
      // Rares
      { name: 'Dragonair', cardNumber: '18/102', rarity: 'Rare', type: 'Normal', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/18_hires.png', weight: 0.24 },
      { name: 'Pidgeotto', cardNumber: '22/102', rarity: 'Rare', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/22_hires.png', weight: 0.24 },
      { name: 'Electabuzz', cardNumber: '20/102', rarity: 'Rare', type: 'Electric', hp: 65, imageUrl: 'https://images.pokemontcg.io/base1/20_hires.png', weight: 0.24 },
      // Uncommons
      { name: 'Charmeleon', cardNumber: '24/102', rarity: 'Uncommon', type: 'Fire', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/24_hires.png', weight: 0.3 },
      { name: 'Ivysaur', cardNumber: '30/102', rarity: 'Uncommon', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/30_hires.png', weight: 0.3 },
      { name: 'Wartortle', cardNumber: '42/102', rarity: 'Uncommon', type: 'Water', hp: 70, imageUrl: 'https://images.pokemontcg.io/base1/42_hires.png', weight: 0.3 },
      // Commons
      { name: 'Charmander', cardNumber: '46/102', rarity: 'Common', type: 'Fire', hp: 50, imageUrl: 'https://images.pokemontcg.io/base1/46_hires.png', weight: 0.8 },
      { name: 'Bulbasaur', cardNumber: '44/102', rarity: 'Common', type: 'Grass', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/44_hires.png', weight: 0.8 },
      { name: 'Squirtle', cardNumber: '63/102', rarity: 'Common', type: 'Water', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/63_hires.png', weight: 0.8 },
      { name: 'Pikachu', cardNumber: '58/102', rarity: 'Common', type: 'Electric', hp: 40, imageUrl: 'https://images.pokemontcg.io/base1/58_hires.png', weight: 0.8 },
    ],
  },

  // ═══════════════════════════════════════════
  // 3. PREMIUM FULL ART — mixed full art hits
  // ═══════════════════════════════════════════
  {
    name: 'Premium Full Art',
    setName: 'Premium Full Art',
    description: 'A curated collection of stunning Full Art cards from across all eras!',
    cost: 750,
    imageUrl: 'https://images.pokemontcg.io/swsh7/logo.png',
    cards: [
      // Ultra Rares — full art alt arts
      { name: 'Umbreon VMAX', cardNumber: '215/203', rarity: 'Ultra Rare', type: 'Dark', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png', weight: 0.016 },
      { name: 'Rayquaza VMAX', cardNumber: '218/203', rarity: 'Ultra Rare', type: 'Dragon', hp: 320, imageUrl: 'https://images.pokemontcg.io/swsh7/218_hires.png', weight: 0.016 },
      { name: 'Pikachu VMAX', cardNumber: '188/185', rarity: 'Ultra Rare', type: 'Electric', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh4/188_hires.png', weight: 0.016 },
      { name: 'Charizard VMAX', cardNumber: '74/73', rarity: 'Ultra Rare', type: 'Fire', hp: 330, imageUrl: 'https://images.pokemontcg.io/swsh35/74_hires.png', weight: 0.016 },
      { name: 'Mew VMAX', cardNumber: '269/264', rarity: 'Ultra Rare', type: 'Psychic', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh8/269_hires.png', weight: 0.016 },
      // Holo Rares — V cards
      { name: 'Umbreon V', cardNumber: '94/203', rarity: 'Holo Rare', type: 'Dark', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/94_hires.png', weight: 0.16 },
      { name: 'Rayquaza V', cardNumber: '110/203', rarity: 'Holo Rare', type: 'Dragon', hp: 210, imageUrl: 'https://images.pokemontcg.io/swsh7/110_hires.png', weight: 0.16 },
      { name: 'Glaceon VMAX', cardNumber: '209/203', rarity: 'Holo Rare', type: 'Water', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/209_hires.png', weight: 0.16 },
      { name: 'Leafeon VMAX', cardNumber: '205/203', rarity: 'Holo Rare', type: 'Grass', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/205_hires.png', weight: 0.16 },
      { name: 'Sylveon VMAX', cardNumber: '212/203', rarity: 'Holo Rare', type: 'Psychic', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/212_hires.png', weight: 0.16 },
      // Rares
      { name: 'Dragonite V', cardNumber: '49/203', rarity: 'Rare', type: 'Dragon', hp: 230, imageUrl: 'https://images.pokemontcg.io/swsh7/49_hires.png', weight: 0.2 },
      { name: 'Espeon V', cardNumber: '64/203', rarity: 'Rare', type: 'Psychic', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/64_hires.png', weight: 0.2 },
      { name: 'Gyarados V', cardNumber: '28/203', rarity: 'Rare', type: 'Water', hp: 220, imageUrl: 'https://images.pokemontcg.io/swsh7/28_hires.png', weight: 0.2 },
      // Uncommons
      { name: 'Eevee', cardNumber: '119/203', rarity: 'Uncommon', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/119_hires.png', weight: 0.3 },
      { name: 'Swablu', cardNumber: '132/203', rarity: 'Uncommon', type: 'Normal', hp: 50, imageUrl: 'https://images.pokemontcg.io/swsh7/132_hires.png', weight: 0.3 },
      { name: 'Dratini', cardNumber: '131/203', rarity: 'Uncommon', type: 'Dragon', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/131_hires.png', weight: 0.3 },
      // Commons
      { name: 'Wooloo', cardNumber: '142/203', rarity: 'Common', type: 'Normal', hp: 70, imageUrl: 'https://images.pokemontcg.io/swsh7/142_hires.png', weight: 0.8 },
      { name: 'Fletchling', cardNumber: '150/203', rarity: 'Common', type: 'Fire', hp: 50, imageUrl: 'https://images.pokemontcg.io/swsh7/150_hires.png', weight: 0.8 },
      { name: 'Magikarp', cardNumber: '23/203', rarity: 'Common', type: 'Water', hp: 30, imageUrl: 'https://images.pokemontcg.io/swsh7/23_hires.png', weight: 0.8 },
    ],
  },

  // ═══════════════════════════════════════════
  // 4. EVOLVING SKIES
  // ═══════════════════════════════════════════
  {
    name: 'Evolving Skies',
    setName: 'Evolving Skies',
    description: 'Soar through the skies with Eeveelution VMAX and Dragon Pokémon!',
    cost: 300,
    imageUrl: 'https://images.pokemontcg.io/swsh7/logo.png',
    cards: [
      // Ultra Rares
      { name: 'Umbreon VMAX (Alt)', cardNumber: '215/203', rarity: 'Ultra Rare', type: 'Dark', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png', weight: 0.16 },
      { name: 'Rayquaza VMAX (Alt)', cardNumber: '218/203', rarity: 'Ultra Rare', type: 'Dragon', hp: 320, imageUrl: 'https://images.pokemontcg.io/swsh7/218_hires.png', weight: 0.16 },
      { name: 'Glaceon VMAX (Alt)', cardNumber: '209/203', rarity: 'Ultra Rare', type: 'Water', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/209_hires.png', weight: 0.16 },
      { name: 'Leafeon VMAX (Alt)', cardNumber: '205/203', rarity: 'Ultra Rare', type: 'Grass', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/205_hires.png', weight: 0.16 },
      { name: 'Sylveon VMAX (Alt)', cardNumber: '212/203', rarity: 'Ultra Rare', type: 'Psychic', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/212_hires.png', weight: 0.16 },
      // Holo Rares
      { name: 'Umbreon V', cardNumber: '94/203', rarity: 'Holo Rare', type: 'Dark', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/94_hires.png', weight: 0.16 },
      { name: 'Rayquaza V', cardNumber: '110/203', rarity: 'Holo Rare', type: 'Dragon', hp: 210, imageUrl: 'https://images.pokemontcg.io/swsh7/110_hires.png', weight: 0.16 },
      { name: 'Glaceon V', cardNumber: '40/203', rarity: 'Holo Rare', type: 'Water', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/40_hires.png', weight: 0.16 },
      { name: 'Leafeon V', cardNumber: '7/203', rarity: 'Holo Rare', type: 'Grass', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/7_hires.png', weight: 0.16 },
      { name: 'Sylveon V', cardNumber: '74/203', rarity: 'Holo Rare', type: 'Psychic', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/74_hires.png', weight: 0.16 },
      { name: 'Espeon V', cardNumber: '64/203', rarity: 'Holo Rare', type: 'Psychic', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/64_hires.png', weight: 0.16 },
      { name: 'Flareon V', cardNumber: '169/203', rarity: 'Holo Rare', type: 'Fire', hp: 210, imageUrl: 'https://images.pokemontcg.io/swsh7/169_hires.png', weight: 0.16 },
      { name: 'Jolteon V', cardNumber: '177/203', rarity: 'Holo Rare', type: 'Electric', hp: 200, imageUrl: 'https://images.pokemontcg.io/swsh7/177_hires.png', weight: 0.16 },
      // Rares
      { name: 'Dragonite V', cardNumber: '49/203', rarity: 'Rare', type: 'Dragon', hp: 230, imageUrl: 'https://images.pokemontcg.io/swsh7/49_hires.png', weight: 0.16 },
      { name: 'Duraludon V', cardNumber: '122/203', rarity: 'Rare', type: 'Dragon', hp: 220, imageUrl: 'https://images.pokemontcg.io/swsh7/122_hires.png', weight: 0.16 },
      { name: 'Gyarados V', cardNumber: '28/203', rarity: 'Rare', type: 'Water', hp: 220, imageUrl: 'https://images.pokemontcg.io/swsh7/28_hires.png', weight: 0.16 },
      { name: 'Golurk V', cardNumber: '70/203', rarity: 'Rare', type: 'Fighting', hp: 220, imageUrl: 'https://images.pokemontcg.io/swsh7/70_hires.png', weight: 0.16 },
      { name: 'Lycanroc V', cardNumber: '87/203', rarity: 'Rare', type: 'Fighting', hp: 210, imageUrl: 'https://images.pokemontcg.io/swsh7/87_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Eevee', cardNumber: '119/203', rarity: 'Uncommon', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/119_hires.png', weight: 0.25 },
      { name: 'Altaria', cardNumber: '106/203', rarity: 'Uncommon', type: 'Dragon', hp: 90, imageUrl: 'https://images.pokemontcg.io/swsh7/106_hires.png', weight: 0.25 },
      { name: 'Dragonair', cardNumber: '117/203', rarity: 'Uncommon', type: 'Dragon', hp: 80, imageUrl: 'https://images.pokemontcg.io/swsh7/117_hires.png', weight: 0.25 },
      { name: 'Swablu', cardNumber: '132/203', rarity: 'Uncommon', type: 'Normal', hp: 50, imageUrl: 'https://images.pokemontcg.io/swsh7/132_hires.png', weight: 0.25 },
      { name: 'Dratini', cardNumber: '131/203', rarity: 'Uncommon', type: 'Dragon', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/131_hires.png', weight: 0.25 },
      { name: 'Togekiss', cardNumber: '85/203', rarity: 'Uncommon', type: 'Psychic', hp: 130, imageUrl: 'https://images.pokemontcg.io/swsh7/85_hires.png', weight: 0.25 },
      // Commons
      { name: 'Wooloo', cardNumber: '142/203', rarity: 'Common', type: 'Normal', hp: 70, imageUrl: 'https://images.pokemontcg.io/swsh7/142_hires.png', weight: 1.0 },
      { name: 'Magikarp', cardNumber: '23/203', rarity: 'Common', type: 'Water', hp: 30, imageUrl: 'https://images.pokemontcg.io/swsh7/23_hires.png', weight: 1.0 },
      { name: 'Mudkip', cardNumber: '32/203', rarity: 'Common', type: 'Water', hp: 70, imageUrl: 'https://images.pokemontcg.io/swsh7/32_hires.png', weight: 1.0 },
      { name: 'Treecko', cardNumber: '4/203', rarity: 'Common', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/4_hires.png', weight: 1.0 },
      { name: 'Torchic', cardNumber: '26/203', rarity: 'Common', type: 'Fire', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/26_hires.png', weight: 1.0 },
      { name: 'Trapinch', cardNumber: '108/203', rarity: 'Common', type: 'Fighting', hp: 70, imageUrl: 'https://images.pokemontcg.io/swsh7/108_hires.png', weight: 1.0 },
      { name: 'Noibat', cardNumber: '112/203', rarity: 'Common', type: 'Dragon', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/112_hires.png', weight: 1.0 },
      { name: 'Shroomish', cardNumber: '10/203', rarity: 'Common', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/swsh7/10_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Umbreon VMAX (Vault Gold)', cardNumber: 'VAULT/ES', rarity: 'Ultra Rare', type: 'Dark', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 5. EX HOLON PHANTOMS
  // ═══════════════════════════════════════════
  {
    name: 'EX Holon Phantoms',
    setName: 'EX Holon Phantoms',
    description: 'Mysterious delta species Pokémon from the Holon region!',
    cost: 350,
    imageUrl: 'https://images.pokemontcg.io/ex11/logo.png',
    cards: [
      // Ultra Rares — ex cards
      { name: 'Mew ex', cardNumber: '100/110', rarity: 'Ultra Rare', type: 'Psychic', hp: 90, imageUrl: 'https://images.pokemontcg.io/ex11/100_hires.png', weight: 0.16 },
      { name: 'Crawdaunt ex', cardNumber: '99/110', rarity: 'Ultra Rare', type: 'Water', hp: 120, imageUrl: 'https://images.pokemontcg.io/ex11/99_hires.png', weight: 0.16 },
      // Holo Rares
      { name: 'Rayquaza δ', cardNumber: '16/110', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/ex6/97_hires.png', weight: 0.16 },
      { name: 'Mewtwo δ', cardNumber: '24/110', rarity: 'Holo Rare', type: 'Electric', hp: 70, imageUrl: 'https://images.pokemontcg.io/ex11/24_hires.png', weight: 0.16 },
      { name: 'Gyarados δ', cardNumber: '8/110', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/ex11/8_hires.png', weight: 0.16 },
      { name: 'Kabutops δ', cardNumber: '9/110', rarity: 'Holo Rare', type: 'Fighting', hp: 100, imageUrl: 'https://images.pokemontcg.io/ex11/9_hires.png', weight: 0.16 },
      { name: 'Pidgeot δ', cardNumber: '14/110', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/ex11/14_hires.png', weight: 0.16 },
      { name: 'Omastar δ', cardNumber: '13/110', rarity: 'Holo Rare', type: 'Fighting', hp: 100, imageUrl: 'https://images.pokemontcg.io/ex11/13_hires.png', weight: 0.16 },
      { name: 'Latios δ', cardNumber: '10/110', rarity: 'Holo Rare', type: 'Electric', hp: 80, imageUrl: 'https://images.pokemontcg.io/ex11/10_hires.png', weight: 0.16 },
      // Rares
      { name: 'Absol', cardNumber: '1/110', rarity: 'Rare', type: 'Dark', hp: 70, imageUrl: 'https://images.pokemontcg.io/ex11/1_hires.png', weight: 0.16 },
      { name: 'Flygon δ', cardNumber: '7/110', rarity: 'Rare', type: 'Grass', hp: 110, imageUrl: 'https://images.pokemontcg.io/ex11/7_hires.png', weight: 0.16 },
      { name: 'Cradily δ', cardNumber: '4/110', rarity: 'Rare', type: 'Dark', hp: 100, imageUrl: 'https://images.pokemontcg.io/ex11/4_hires.png', weight: 0.16 },
      { name: 'Armaldo δ', cardNumber: '3/110', rarity: 'Rare', type: 'Fighting', hp: 110, imageUrl: 'https://images.pokemontcg.io/ex11/3_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Vibrava δ', cardNumber: '35/110', rarity: 'Uncommon', type: 'Grass', hp: 70, imageUrl: 'https://images.pokemontcg.io/ex11/35_hires.png', weight: 0.25 },
      { name: 'Omanyte δ', cardNumber: '56/110', rarity: 'Uncommon', type: 'Fighting', hp: 60, imageUrl: 'https://images.pokemontcg.io/ex11/56_hires.png', weight: 0.25 },
      { name: 'Kabuto δ', cardNumber: '50/110', rarity: 'Uncommon', type: 'Fighting', hp: 60, imageUrl: 'https://images.pokemontcg.io/ex11/50_hires.png', weight: 0.25 },
      { name: 'Pidgeotto δ', cardNumber: '30/110', rarity: 'Uncommon', type: 'Electric', hp: 70, imageUrl: 'https://images.pokemontcg.io/ex11/30_hires.png', weight: 0.25 },
      { name: 'Seadra δ', cardNumber: '31/110', rarity: 'Uncommon', type: 'Fire', hp: 70, imageUrl: 'https://images.pokemontcg.io/ex11/31_hires.png', weight: 0.25 },
      // Commons
      { name: 'Pidgey δ', cardNumber: '64/110', rarity: 'Common', type: 'Electric', hp: 40, imageUrl: 'https://images.pokemontcg.io/ex11/64_hires.png', weight: 1.0 },
      { name: 'Horsea δ', cardNumber: '47/110', rarity: 'Common', type: 'Fire', hp: 40, imageUrl: 'https://images.pokemontcg.io/ex11/47_hires.png', weight: 1.0 },
      { name: 'Trapinch δ', cardNumber: '72/110', rarity: 'Common', type: 'Psychic', hp: 50, imageUrl: 'https://images.pokemontcg.io/ex11/72_hires.png', weight: 1.0 },
      { name: 'Pikachu δ', cardNumber: '63/110', rarity: 'Common', type: 'Electric', hp: 50, imageUrl: 'https://images.pokemontcg.io/ex11/63_hires.png', weight: 1.0 },
      { name: 'Lileep δ', cardNumber: '52/110', rarity: 'Common', type: 'Dark', hp: 60, imageUrl: 'https://images.pokemontcg.io/ex11/52_hires.png', weight: 1.0 },
      { name: 'Anorith δ', cardNumber: '37/110', rarity: 'Common', type: 'Fighting', hp: 50, imageUrl: 'https://images.pokemontcg.io/ex11/37_hires.png', weight: 1.0 },
      { name: 'Magnemite δ', cardNumber: '54/110', rarity: 'Common', type: 'Electric', hp: 40, imageUrl: 'https://images.pokemontcg.io/ex11/54_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Gold Star Mew δ (Vault)', cardNumber: 'VAULT/HP', rarity: 'Ultra Rare', type: 'Psychic', hp: 90, imageUrl: 'https://images.pokemontcg.io/ex11/100_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 6. THE VAULT: GOLD & SILVER
  // ═══════════════════════════════════════════
  {
    name: 'The Vault: Gold & Silver',
    setName: 'The Vault: Gold & Silver',
    description: 'Revisit the Johto region with classic Neo-era Pokémon!',
    cost: 400,
    imageUrl: 'https://images.pokemontcg.io/neo1/logo.png',
    cards: [
      // Ultra Rares — the chase cards
      { name: 'Lugia', cardNumber: '9/111', rarity: 'Ultra Rare', type: 'Psychic', hp: 90, imageUrl: 'https://images.pokemontcg.io/neo1/9_hires.png', weight: 0.16 },
      { name: 'Ho-Oh', cardNumber: '7/64', rarity: 'Ultra Rare', type: 'Fire', hp: 90, imageUrl: 'https://images.pokemontcg.io/neo3/7_hires.png', weight: 0.16 },
      // Holo Rares
      { name: 'Typhlosion', cardNumber: '17/111', rarity: 'Holo Rare', type: 'Fire', hp: 100, imageUrl: 'https://images.pokemontcg.io/neo1/17_hires.png', weight: 0.16 },
      { name: 'Feraligatr', cardNumber: '5/111', rarity: 'Holo Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/neo1/5_hires.png', weight: 0.16 },
      { name: 'Meganium', cardNumber: '10/111', rarity: 'Holo Rare', type: 'Grass', hp: 100, imageUrl: 'https://images.pokemontcg.io/neo1/10_hires.png', weight: 0.16 },
      { name: 'Togetic', cardNumber: '16/111', rarity: 'Holo Rare', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/neo1/16_hires.png', weight: 0.16 },
      { name: 'Heracross', cardNumber: '6/111', rarity: 'Holo Rare', type: 'Grass', hp: 70, imageUrl: 'https://images.pokemontcg.io/neo1/6_hires.png', weight: 0.16 },
      { name: 'Kingdra', cardNumber: '8/111', rarity: 'Holo Rare', type: 'Water', hp: 90, imageUrl: 'https://images.pokemontcg.io/neo1/8_hires.png', weight: 0.16 },
      { name: 'Ampharos', cardNumber: '1/111', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/neo1/1_hires.png', weight: 0.16 },
      { name: 'Steelix', cardNumber: '15/111', rarity: 'Holo Rare', type: 'Fighting', hp: 100, imageUrl: 'https://images.pokemontcg.io/neo1/15_hires.png', weight: 0.16 },
      // Rares
      { name: 'Pichu', cardNumber: '12/111', rarity: 'Rare', type: 'Electric', hp: 30, imageUrl: 'https://images.pokemontcg.io/neo1/12_hires.png', weight: 0.16 },
      { name: 'Murkrow', cardNumber: '24/111', rarity: 'Rare', type: 'Dark', hp: 50, imageUrl: 'https://images.pokemontcg.io/neo1/24_hires.png', weight: 0.16 },
      { name: 'Donphan', cardNumber: '21/111', rarity: 'Rare', type: 'Fighting', hp: 70, imageUrl: 'https://images.pokemontcg.io/neo1/21_hires.png', weight: 0.16 },
      { name: 'Skarmory', cardNumber: '27/111', rarity: 'Rare', type: 'Fighting', hp: 60, imageUrl: 'https://images.pokemontcg.io/neo1/27_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Quilava', cardNumber: '47/111', rarity: 'Uncommon', type: 'Fire', hp: 60, imageUrl: 'https://images.pokemontcg.io/neo1/47_hires.png', weight: 0.25 },
      { name: 'Croconaw', cardNumber: '32/111', rarity: 'Uncommon', type: 'Water', hp: 70, imageUrl: 'https://images.pokemontcg.io/neo1/32_hires.png', weight: 0.25 },
      { name: 'Bayleef', cardNumber: '29/111', rarity: 'Uncommon', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/neo1/29_hires.png', weight: 0.25 },
      { name: 'Flaaffy', cardNumber: '34/111', rarity: 'Uncommon', type: 'Electric', hp: 70, imageUrl: 'https://images.pokemontcg.io/neo1/34_hires.png', weight: 0.25 },
      { name: 'Sunflora', cardNumber: '52/111', rarity: 'Uncommon', type: 'Grass', hp: 70, imageUrl: 'https://images.pokemontcg.io/neo1/52_hires.png', weight: 0.25 },
      // Commons
      { name: 'Cyndaquil', cardNumber: '56/111', rarity: 'Common', type: 'Fire', hp: 40, imageUrl: 'https://images.pokemontcg.io/neo1/56_hires.png', weight: 1.0 },
      { name: 'Totodile', cardNumber: '80/111', rarity: 'Common', type: 'Water', hp: 50, imageUrl: 'https://images.pokemontcg.io/neo1/80_hires.png', weight: 1.0 },
      { name: 'Chikorita', cardNumber: '54/111', rarity: 'Common', type: 'Grass', hp: 50, imageUrl: 'https://images.pokemontcg.io/neo1/54_hires.png', weight: 1.0 },
      { name: 'Mareep', cardNumber: '65/111', rarity: 'Common', type: 'Electric', hp: 40, imageUrl: 'https://images.pokemontcg.io/neo1/65_hires.png', weight: 1.0 },
      { name: 'Sentret', cardNumber: '74/111', rarity: 'Common', type: 'Normal', hp: 40, imageUrl: 'https://images.pokemontcg.io/neo1/74_hires.png', weight: 1.0 },
      { name: 'Marill', cardNumber: '66/111', rarity: 'Common', type: 'Water', hp: 50, imageUrl: 'https://images.pokemontcg.io/neo1/66_hires.png', weight: 1.0 },
      { name: 'Sunkern', cardNumber: '78/111', rarity: 'Common', type: 'Grass', hp: 30, imageUrl: 'https://images.pokemontcg.io/neo1/78_hires.png', weight: 1.0 },
      { name: 'Hoothoot', cardNumber: '61/111', rarity: 'Common', type: 'Normal', hp: 50, imageUrl: 'https://images.pokemontcg.io/neo1/61_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Shining Lugia (Vault)', cardNumber: 'VAULT/GS', rarity: 'Ultra Rare', type: 'Psychic', hp: 110, imageUrl: 'https://images.pokemontcg.io/neo1/9_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 7. DIAMOND & PEARL: LV.X LEGENDS
  // ═══════════════════════════════════════════
  {
    name: 'Diamond & Pearl: LV.X Legends',
    setName: 'Diamond & Pearl: LV.X Legends',
    description: 'Level up your Pokémon to LV.X and unleash their ultimate power!',
    cost: 400,
    imageUrl: 'https://images.pokemontcg.io/dp1/logo.png',
    cards: [
      // Ultra Rares — LV.X
      { name: 'Infernape LV.X', cardNumber: '121/130', rarity: 'Ultra Rare', type: 'Fire', hp: 120, imageUrl: 'https://images.pokemontcg.io/dp1/121_hires.png', weight: 0.16 },
      { name: 'Empoleon LV.X', cardNumber: '120/130', rarity: 'Ultra Rare', type: 'Water', hp: 140, imageUrl: 'https://images.pokemontcg.io/dp1/120_hires.png', weight: 0.16 },
      { name: 'Torterra LV.X', cardNumber: '122/130', rarity: 'Ultra Rare', type: 'Grass', hp: 160, imageUrl: 'https://images.pokemontcg.io/dp1/122_hires.png', weight: 0.16 },
      // Holo Rares
      { name: 'Dialga', cardNumber: '1/130', rarity: 'Holo Rare', type: 'Fighting', hp: 100, imageUrl: 'https://images.pokemontcg.io/dp1/1_hires.png', weight: 0.16 },
      { name: 'Palkia', cardNumber: '11/130', rarity: 'Holo Rare', type: 'Water', hp: 90, imageUrl: 'https://images.pokemontcg.io/dp1/11_hires.png', weight: 0.16 },
      { name: 'Infernape', cardNumber: '5/130', rarity: 'Holo Rare', type: 'Fire', hp: 100, imageUrl: 'https://images.pokemontcg.io/dp1/5_hires.png', weight: 0.16 },
      { name: 'Empoleon', cardNumber: '4/130', rarity: 'Holo Rare', type: 'Water', hp: 130, imageUrl: 'https://images.pokemontcg.io/dp1/4_hires.png', weight: 0.16 },
      { name: 'Torterra', cardNumber: '17/130', rarity: 'Holo Rare', type: 'Grass', hp: 140, imageUrl: 'https://images.pokemontcg.io/dp1/17_hires.png', weight: 0.16 },
      { name: 'Luxray', cardNumber: '7/130', rarity: 'Holo Rare', type: 'Electric', hp: 120, imageUrl: 'https://images.pokemontcg.io/dp1/7_hires.png', weight: 0.16 },
      { name: 'Roserade', cardNumber: '13/130', rarity: 'Holo Rare', type: 'Grass', hp: 90, imageUrl: 'https://images.pokemontcg.io/dp1/13_hires.png', weight: 0.16 },
      { name: 'Staraptor', cardNumber: '16/130', rarity: 'Holo Rare', type: 'Normal', hp: 100, imageUrl: 'https://images.pokemontcg.io/dp1/16_hires.png', weight: 0.16 },
      // Rares
      { name: 'Munchlax', cardNumber: '33/130', rarity: 'Rare', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/dp1/33_hires.png', weight: 0.16 },
      { name: 'Floatzel', cardNumber: '26/130', rarity: 'Rare', type: 'Water', hp: 80, imageUrl: 'https://images.pokemontcg.io/dp1/26_hires.png', weight: 0.16 },
      { name: 'Heracross', cardNumber: '28/130', rarity: 'Rare', type: 'Grass', hp: 80, imageUrl: 'https://images.pokemontcg.io/dp1/28_hires.png', weight: 0.16 },
      { name: 'Drapion', cardNumber: '23/130', rarity: 'Rare', type: 'Psychic', hp: 90, imageUrl: 'https://images.pokemontcg.io/dp1/23_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Monferno', cardNumber: '56/130', rarity: 'Uncommon', type: 'Fire', hp: 70, imageUrl: 'https://images.pokemontcg.io/dp1/56_hires.png', weight: 0.25 },
      { name: 'Prinplup', cardNumber: '58/130', rarity: 'Uncommon', type: 'Water', hp: 80, imageUrl: 'https://images.pokemontcg.io/dp1/58_hires.png', weight: 0.25 },
      { name: 'Grotle', cardNumber: '49/130', rarity: 'Uncommon', type: 'Grass', hp: 90, imageUrl: 'https://images.pokemontcg.io/dp1/49_hires.png', weight: 0.25 },
      { name: 'Luxio', cardNumber: '52/130', rarity: 'Uncommon', type: 'Electric', hp: 80, imageUrl: 'https://images.pokemontcg.io/dp1/52_hires.png', weight: 0.25 },
      { name: 'Staravia', cardNumber: '64/130', rarity: 'Uncommon', type: 'Normal', hp: 70, imageUrl: 'https://images.pokemontcg.io/dp1/64_hires.png', weight: 0.25 },
      // Commons
      { name: 'Chimchar', cardNumber: '76/130', rarity: 'Common', type: 'Fire', hp: 50, imageUrl: 'https://images.pokemontcg.io/dp1/76_hires.png', weight: 1.0 },
      { name: 'Piplup', cardNumber: '93/130', rarity: 'Common', type: 'Water', hp: 60, imageUrl: 'https://images.pokemontcg.io/dp1/93_hires.png', weight: 1.0 },
      { name: 'Turtwig', cardNumber: '103/130', rarity: 'Common', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/dp1/103_hires.png', weight: 1.0 },
      { name: 'Shinx', cardNumber: '98/130', rarity: 'Common', type: 'Electric', hp: 60, imageUrl: 'https://images.pokemontcg.io/dp1/98_hires.png', weight: 1.0 },
      { name: 'Starly', cardNumber: '100/130', rarity: 'Common', type: 'Normal', hp: 50, imageUrl: 'https://images.pokemontcg.io/dp1/100_hires.png', weight: 1.0 },
      { name: 'Bidoof', cardNumber: '70/130', rarity: 'Common', type: 'Normal', hp: 50, imageUrl: 'https://images.pokemontcg.io/dp1/70_hires.png', weight: 1.0 },
      { name: 'Budew', cardNumber: '74/130', rarity: 'Common', type: 'Grass', hp: 40, imageUrl: 'https://images.pokemontcg.io/dp1/74_hires.png', weight: 1.0 },
      { name: 'Buizel', cardNumber: '72/130', rarity: 'Common', type: 'Water', hp: 60, imageUrl: 'https://images.pokemontcg.io/dp1/72_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Arceus LV.X (Vault)', cardNumber: 'VAULT/DP', rarity: 'Ultra Rare', type: 'Normal', hp: 120, imageUrl: 'https://images.pokemontcg.io/dp1/1_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 8. XY: MEGA EVOLUTION
  // ═══════════════════════════════════════════
  {
    name: 'XY: Mega Evolution',
    setName: 'XY: Mega Evolution',
    description: 'Unleash the power of Mega Evolution with Mega EX Pokémon!',
    cost: 350,
    imageUrl: 'https://images.pokemontcg.io/xy1/logo.png',
    cards: [
      // Ultra Rares — Mega EX
      { name: 'Mega Venusaur EX', cardNumber: '2/146', rarity: 'Ultra Rare', type: 'Grass', hp: 230, imageUrl: 'https://images.pokemontcg.io/xy1/2_hires.png', weight: 0.16 },
      { name: 'Mega Blastoise EX', cardNumber: '30/146', rarity: 'Ultra Rare', type: 'Water', hp: 220, imageUrl: 'https://images.pokemontcg.io/xy1/30_hires.png', weight: 0.16 },
      { name: 'Mega Charizard EX (Y)', cardNumber: '13/106', rarity: 'Ultra Rare', type: 'Fire', hp: 220, imageUrl: 'https://images.pokemontcg.io/xy2/13_hires.png', weight: 0.16 },
      { name: 'Mega Charizard EX (X)', cardNumber: '69/106', rarity: 'Ultra Rare', type: 'Dragon', hp: 230, imageUrl: 'https://images.pokemontcg.io/xy2/69_hires.png', weight: 0.16 },
      { name: 'Mega Kangaskhan EX', cardNumber: '79/146', rarity: 'Ultra Rare', type: 'Normal', hp: 230, imageUrl: 'https://images.pokemontcg.io/xy1/79_hires.png', weight: 0.16 },
      // Holo Rares — EX cards
      { name: 'Venusaur EX', cardNumber: '1/146', rarity: 'Holo Rare', type: 'Grass', hp: 180, imageUrl: 'https://images.pokemontcg.io/xy1/1_hires.png', weight: 0.16 },
      { name: 'Blastoise EX', cardNumber: '29/146', rarity: 'Holo Rare', type: 'Water', hp: 180, imageUrl: 'https://images.pokemontcg.io/xy1/29_hires.png', weight: 0.16 },
      { name: 'Emolga EX', cardNumber: '46/146', rarity: 'Holo Rare', type: 'Electric', hp: 110, imageUrl: 'https://images.pokemontcg.io/xy1/46_hires.png', weight: 0.16 },
      { name: 'Skarmory EX', cardNumber: '80/146', rarity: 'Holo Rare', type: 'Fighting', hp: 170, imageUrl: 'https://images.pokemontcg.io/xy1/80_hires.png', weight: 0.16 },
      { name: 'Yveltal EX', cardNumber: '144/146', rarity: 'Holo Rare', type: 'Dark', hp: 170, imageUrl: 'https://images.pokemontcg.io/xy1/144_hires.png', weight: 0.16 },
      { name: 'Xerneas EX', cardNumber: '146/146', rarity: 'Holo Rare', type: 'Psychic', hp: 170, imageUrl: 'https://images.pokemontcg.io/xy1/146_hires.png', weight: 0.16 },
      // Rares
      { name: 'Trevenant', cardNumber: '55/146', rarity: 'Rare', type: 'Psychic', hp: 110, imageUrl: 'https://images.pokemontcg.io/xy1/55_hires.png', weight: 0.16 },
      { name: 'Raichu', cardNumber: '43/146', rarity: 'Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/xy1/43_hires.png', weight: 0.16 },
      { name: 'Aromatisse', cardNumber: '93/146', rarity: 'Rare', type: 'Psychic', hp: 90, imageUrl: 'https://images.pokemontcg.io/xy1/93_hires.png', weight: 0.16 },
      { name: 'Aegislash', cardNumber: '86/146', rarity: 'Rare', type: 'Fighting', hp: 140, imageUrl: 'https://images.pokemontcg.io/xy1/86_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Frogadier', cardNumber: '40/146', rarity: 'Uncommon', type: 'Water', hp: 70, imageUrl: 'https://images.pokemontcg.io/xy1/40_hires.png', weight: 0.25 },
      { name: 'Braixen', cardNumber: '25/146', rarity: 'Uncommon', type: 'Fire', hp: 80, imageUrl: 'https://images.pokemontcg.io/xy1/25_hires.png', weight: 0.25 },
      { name: 'Quilladin', cardNumber: '14/146', rarity: 'Uncommon', type: 'Grass', hp: 90, imageUrl: 'https://images.pokemontcg.io/xy1/14_hires.png', weight: 0.25 },
      { name: 'Doublade', cardNumber: '85/146', rarity: 'Uncommon', type: 'Fighting', hp: 80, imageUrl: 'https://images.pokemontcg.io/xy1/85_hires.png', weight: 0.25 },
      { name: 'Pikachu', cardNumber: '42/146', rarity: 'Uncommon', type: 'Electric', hp: 60, imageUrl: 'https://images.pokemontcg.io/xy1/42_hires.png', weight: 0.25 },
      // Commons
      { name: 'Froakie', cardNumber: '39/146', rarity: 'Common', type: 'Water', hp: 50, imageUrl: 'https://images.pokemontcg.io/xy1/39_hires.png', weight: 1.0 },
      { name: 'Fennekin', cardNumber: '24/146', rarity: 'Common', type: 'Fire', hp: 60, imageUrl: 'https://images.pokemontcg.io/xy1/24_hires.png', weight: 1.0 },
      { name: 'Chespin', cardNumber: '13/146', rarity: 'Common', type: 'Grass', hp: 60, imageUrl: 'https://images.pokemontcg.io/xy1/13_hires.png', weight: 1.0 },
      { name: 'Honedge', cardNumber: '84/146', rarity: 'Common', type: 'Fighting', hp: 60, imageUrl: 'https://images.pokemontcg.io/xy1/84_hires.png', weight: 1.0 },
      { name: 'Fletchling', cardNumber: '89/146', rarity: 'Common', type: 'Normal', hp: 50, imageUrl: 'https://images.pokemontcg.io/xy1/89_hires.png', weight: 1.0 },
      { name: 'Bunnelby', cardNumber: '97/146', rarity: 'Common', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/xy1/97_hires.png', weight: 1.0 },
      { name: 'Litleo', cardNumber: '18/146', rarity: 'Common', type: 'Fire', hp: 60, imageUrl: 'https://images.pokemontcg.io/xy1/18_hires.png', weight: 1.0 },
      { name: 'Skiddo', cardNumber: '16/146', rarity: 'Common', type: 'Grass', hp: 70, imageUrl: 'https://images.pokemontcg.io/xy1/16_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Mega Charizard (Vault Gold)', cardNumber: 'VAULT/XY', rarity: 'Ultra Rare', type: 'Fire', hp: 300, imageUrl: 'https://images.pokemontcg.io/xy2/69_hires.png', weight: 0, vaultOnly: true },
    ],
  },
  // ═══════════════════════════════════════════
  // 9. POKÉMON 151 (Scarlet & Violet)
  // ═══════════════════════════════════════════
  {
    name: 'Pokémon 151',
    setName: 'Pokémon 151',
    description: 'The original 151 Pokémon reimagined for Scarlet & Violet!',
    cost: 350,
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/logo.png',
    cards: [
      // Ultra Rares
      { name: 'Charizard ex (SAR)', cardNumber: '199/165', rarity: 'Ultra Rare', type: 'Fire', hp: 330, imageUrl: 'https://images.pokemontcg.io/sv3pt5/199_hires.png', weight: 0.01 },
      { name: 'Mew ex (SAR)', cardNumber: '205/165', rarity: 'Ultra Rare', type: 'Psychic', hp: 180, imageUrl: 'https://images.pokemontcg.io/sv3pt5/205_hires.png', weight: 0.01 },
      { name: 'Alakazam ex (SAR)', cardNumber: '201/165', rarity: 'Ultra Rare', type: 'Psychic', hp: 310, imageUrl: 'https://images.pokemontcg.io/sv3pt5/201_hires.png', weight: 0.01 },
      { name: 'Erika\'s Invitation (SAR)', cardNumber: '203/165', rarity: 'Ultra Rare', type: 'Normal', hp: null, imageUrl: 'https://images.pokemontcg.io/sv3pt5/203_hires.png', weight: 0.01 },
      // Holo Rares
      { name: 'Charizard ex', cardNumber: '6/165', rarity: 'Holo Rare', type: 'Fire', hp: 330, imageUrl: 'https://images.pokemontcg.io/sv3pt5/6_hires.png', weight: 0.04 },
      { name: 'Mew ex', cardNumber: '151/165', rarity: 'Holo Rare', type: 'Psychic', hp: 180, imageUrl: 'https://images.pokemontcg.io/sv3pt5/151_hires.png', weight: 0.04 },
      { name: 'Alakazam ex', cardNumber: '65/165', rarity: 'Holo Rare', type: 'Psychic', hp: 310, imageUrl: 'https://images.pokemontcg.io/sv3pt5/65_hires.png', weight: 0.04 },
      { name: 'Arcanine ex', cardNumber: '59/165', rarity: 'Holo Rare', type: 'Fire', hp: 300, imageUrl: 'https://images.pokemontcg.io/sv3pt5/59_hires.png', weight: 0.04 },
      { name: 'Ninetales ex', cardNumber: '38/165', rarity: 'Holo Rare', type: 'Fire', hp: 300, imageUrl: 'https://images.pokemontcg.io/sv3pt5/38_hires.png', weight: 0.04 },
      { name: 'Golem ex', cardNumber: '76/165', rarity: 'Holo Rare', type: 'Fighting', hp: 330, imageUrl: 'https://images.pokemontcg.io/sv3pt5/76_hires.png', weight: 0.04 },
      // Rares
      { name: 'Dragonite', cardNumber: '149/165', rarity: 'Rare', type: 'Dragon', hp: 160, imageUrl: 'https://images.pokemontcg.io/sv3pt5/149_hires.png', weight: 0.16 },
      { name: 'Gengar', cardNumber: '94/165', rarity: 'Rare', type: 'Psychic', hp: 130, imageUrl: 'https://images.pokemontcg.io/sv3pt5/94_hires.png', weight: 0.16 },
      { name: 'Snorlax', cardNumber: '143/165', rarity: 'Rare', type: 'Normal', hp: 150, imageUrl: 'https://images.pokemontcg.io/sv3pt5/143_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Charmeleon', cardNumber: '5/165', rarity: 'Uncommon', type: 'Fire', hp: 100, imageUrl: 'https://images.pokemontcg.io/sv3pt5/5_hires.png', weight: 0.25 },
      { name: 'Haunter', cardNumber: '93/165', rarity: 'Uncommon', type: 'Psychic', hp: 80, imageUrl: 'https://images.pokemontcg.io/sv3pt5/93_hires.png', weight: 0.25 },
      { name: 'Ivysaur', cardNumber: '2/165', rarity: 'Uncommon', type: 'Grass', hp: 90, imageUrl: 'https://images.pokemontcg.io/sv3pt5/2_hires.png', weight: 0.25 },
      { name: 'Wartortle', cardNumber: '8/165', rarity: 'Uncommon', type: 'Water', hp: 80, imageUrl: 'https://images.pokemontcg.io/sv3pt5/8_hires.png', weight: 0.25 },
      // Commons
      { name: 'Charmander', cardNumber: '4/165', rarity: 'Common', type: 'Fire', hp: 60, imageUrl: 'https://images.pokemontcg.io/sv3pt5/4_hires.png', weight: 1.0 },
      { name: 'Bulbasaur', cardNumber: '1/165', rarity: 'Common', type: 'Grass', hp: 70, imageUrl: 'https://images.pokemontcg.io/sv3pt5/1_hires.png', weight: 1.0 },
      { name: 'Squirtle', cardNumber: '7/165', rarity: 'Common', type: 'Water', hp: 60, imageUrl: 'https://images.pokemontcg.io/sv3pt5/7_hires.png', weight: 1.0 },
      { name: 'Pikachu', cardNumber: '25/165', rarity: 'Common', type: 'Electric', hp: 60, imageUrl: 'https://images.pokemontcg.io/sv3pt5/25_hires.png', weight: 1.0 },
      { name: 'Gastly', cardNumber: '92/165', rarity: 'Common', type: 'Psychic', hp: 40, imageUrl: 'https://images.pokemontcg.io/sv3pt5/92_hires.png', weight: 1.0 },
      { name: 'Eevee', cardNumber: '133/165', rarity: 'Common', type: 'Normal', hp: 60, imageUrl: 'https://images.pokemontcg.io/sv3pt5/133_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Mew (Vault Illustration)', cardNumber: 'VAULT/151', rarity: 'Ultra Rare', type: 'Psychic', hp: 180, imageUrl: 'https://images.pokemontcg.io/sv3pt5/205_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 10. HIDDEN FATES (Sun & Moon)
  // ═══════════════════════════════════════════
  {
    name: 'Hidden Fates',
    setName: 'Hidden Fates',
    description: 'Hunt the Shiny Vault! Shiny GX Pokémon and rare promos!',
    cost: 400,
    imageUrl: 'https://images.pokemontcg.io/sm115/logo.png',
    cards: [
      // Ultra Rares — Shiny GX
      { name: 'Charizard GX (Shiny)', cardNumber: 'SV49/SV94', rarity: 'Ultra Rare', type: 'Fire', hp: 250, imageUrl: 'https://images.pokemontcg.io/sma/SV49_hires.png', weight: 0.01 },
      { name: 'Mewtwo GX (Shiny)', cardNumber: 'SV59/SV94', rarity: 'Ultra Rare', type: 'Psychic', hp: 190, imageUrl: 'https://images.pokemontcg.io/sm115/SV59_hires.png', weight: 0.01 },
      { name: 'Espeon GX (Shiny)', cardNumber: 'SV60/SV94', rarity: 'Ultra Rare', type: 'Psychic', hp: 200, imageUrl: 'https://images.pokemontcg.io/sm115/SV60_hires.png', weight: 0.01 },
      { name: 'Umbreon GX (Shiny)', cardNumber: 'SV69/SV94', rarity: 'Ultra Rare', type: 'Dark', hp: 200, imageUrl: 'https://images.pokemontcg.io/sm115/SV69_hires.png', weight: 0.01 },
      // Holo Rares — GX and Shiny
      { name: 'Cynthia (Full Art)', cardNumber: '60/68', rarity: 'Holo Rare', type: 'Normal', hp: null, imageUrl: 'https://images.pokemontcg.io/sm115/60_hires.png', weight: 0.04 },
      { name: 'Jessie & James (FA)', cardNumber: '58/68', rarity: 'Holo Rare', type: 'Normal', hp: null, imageUrl: 'https://images.pokemontcg.io/sm115/58_hires.png', weight: 0.04 },
      { name: 'Gyarados GX', cardNumber: '18/68', rarity: 'Holo Rare', type: 'Water', hp: 240, imageUrl: 'https://images.pokemontcg.io/sm115/18_hires.png', weight: 0.04 },
      { name: 'Onix GX', cardNumber: '36/68', rarity: 'Holo Rare', type: 'Fighting', hp: 200, imageUrl: 'https://images.pokemontcg.io/sm115/36_hires.png', weight: 0.04 },
      { name: 'Starmie GX', cardNumber: '14/68', rarity: 'Holo Rare', type: 'Water', hp: 190, imageUrl: 'https://images.pokemontcg.io/sm115/14_hires.png', weight: 0.04 },
      // Rares
      { name: 'Charizard', cardNumber: '7/68', rarity: 'Rare', type: 'Fire', hp: 150, imageUrl: 'https://images.pokemontcg.io/sm115/7_hires.png', weight: 0.16 },
      { name: 'Starmie', cardNumber: '13/68', rarity: 'Rare', type: 'Water', hp: 90, imageUrl: 'https://images.pokemontcg.io/sm115/13_hires.png', weight: 0.16 },
      { name: 'Electrode', cardNumber: '22/68', rarity: 'Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/sm115/22_hires.png', weight: 0.16 },
      // Uncommons
      { name: 'Charmeleon', cardNumber: '6/68', rarity: 'Uncommon', type: 'Fire', hp: 90, imageUrl: 'https://images.pokemontcg.io/sm115/6_hires.png', weight: 0.25 },
      { name: 'Staryu', cardNumber: '12/68', rarity: 'Uncommon', type: 'Water', hp: 50, imageUrl: 'https://images.pokemontcg.io/sm115/12_hires.png', weight: 0.25 },
      { name: 'Voltorb', cardNumber: '21/68', rarity: 'Uncommon', type: 'Electric', hp: 50, imageUrl: 'https://images.pokemontcg.io/sm115/21_hires.png', weight: 0.25 },
      { name: 'Weezing', cardNumber: '29/68', rarity: 'Uncommon', type: 'Psychic', hp: 120, imageUrl: 'https://images.pokemontcg.io/sm115/29_hires.png', weight: 0.25 },
      // Commons
      { name: 'Charmander', cardNumber: '5/68', rarity: 'Common', type: 'Fire', hp: 70, imageUrl: 'https://images.pokemontcg.io/sm115/5_hires.png', weight: 1.0 },
      { name: 'Psyduck', cardNumber: '11/68', rarity: 'Common', type: 'Water', hp: 70, imageUrl: 'https://images.pokemontcg.io/sm115/11_hires.png', weight: 1.0 },
      { name: 'Koffing', cardNumber: '28/68', rarity: 'Common', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/sm115/28_hires.png', weight: 1.0 },
      { name: 'Geodude', cardNumber: '34/68', rarity: 'Common', type: 'Fighting', hp: 70, imageUrl: 'https://images.pokemontcg.io/sm115/34_hires.png', weight: 1.0 },
      { name: 'Ekans', cardNumber: '26/68', rarity: 'Common', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/sm115/26_hires.png', weight: 1.0 },
      // Vault Exclusive Reward
      { name: 'Shiny Charizard VSTAR (Vault)', cardNumber: 'VAULT/HF', rarity: 'Ultra Rare', type: 'Fire', hp: 280, imageUrl: 'https://images.pokemontcg.io/sm115/SV49_hires.png', weight: 0, vaultOnly: true },
    ],
  },

  // ═══════════════════════════════════════════
  // 11. THE GOD PACK — Guaranteed big hits only
  // ═══════════════════════════════════════════
  {
    name: 'The God Pack',
    setName: 'The God Pack',
    description: 'Every card is Holo Rare or better. The ultimate chase pack — 15,000 coins!',
    cost: 15000,
    imageUrl: 'https://images.pokemontcg.io/swsh7/logo.png',
    cards: [
      // Ultra Rares — high weight so they actually hit often at this price
      { name: 'Charizard (Base)', cardNumber: '4/102', rarity: 'Ultra Rare', type: 'Fire', hp: 120, imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png', weight: 0.3 },
      { name: 'Umbreon VMAX (Alt)', cardNumber: '215/203', rarity: 'Ultra Rare', type: 'Dark', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png', weight: 0.3 },
      { name: 'Rayquaza VMAX (Alt)', cardNumber: '218/203', rarity: 'Ultra Rare', type: 'Dragon', hp: 320, imageUrl: 'https://images.pokemontcg.io/swsh7/218_hires.png', weight: 0.3 },
      { name: 'Charizard VMAX (Shiny)', cardNumber: '74/73', rarity: 'Ultra Rare', type: 'Fire', hp: 330, imageUrl: 'https://images.pokemontcg.io/swsh35/74_hires.png', weight: 0.3 },
      { name: 'Charizard GX (Shiny)', cardNumber: 'SV49/SV94', rarity: 'Ultra Rare', type: 'Fire', hp: 250, imageUrl: 'https://images.pokemontcg.io/sma/SV49_hires.png', weight: 0.3 },
      { name: 'Mew ex (SAR)', cardNumber: '205/165', rarity: 'Ultra Rare', type: 'Psychic', hp: 180, imageUrl: 'https://images.pokemontcg.io/sv3pt5/205_hires.png', weight: 0.3 },
      { name: 'Lugia (Neo)', cardNumber: '9/111', rarity: 'Ultra Rare', type: 'Psychic', hp: 90, imageUrl: 'https://images.pokemontcg.io/neo1/9_hires.png', weight: 0.3 },
      { name: 'Pikachu VMAX (RR)', cardNumber: '188/185', rarity: 'Ultra Rare', type: 'Electric', hp: 310, imageUrl: 'https://images.pokemontcg.io/swsh4/188_hires.png', weight: 0.3 },
      { name: 'M Charizard EX (X)', cardNumber: '69/106', rarity: 'Ultra Rare', type: 'Dragon', hp: 230, imageUrl: 'https://images.pokemontcg.io/xy2/69_hires.png', weight: 0.3 },
      { name: 'M Charizard EX (Y)', cardNumber: '13/106', rarity: 'Ultra Rare', type: 'Fire', hp: 220, imageUrl: 'https://images.pokemontcg.io/xy2/13_hires.png', weight: 0.3 },
      // Holo Rares — the "floor" pulls (still very good)
      { name: 'Mewtwo (Holo)', cardNumber: '10/102', rarity: 'Holo Rare', type: 'Psychic', hp: 60, imageUrl: 'https://images.pokemontcg.io/base1/10_hires.png', weight: 0.5 },
      { name: 'Blastoise (Holo)', cardNumber: '2/102', rarity: 'Holo Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png', weight: 0.5 },
      { name: 'Venusaur (Holo)', cardNumber: '15/102', rarity: 'Holo Rare', type: 'Grass', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/15_hires.png', weight: 0.5 },
      { name: 'Gyarados (Holo)', cardNumber: '6/102', rarity: 'Holo Rare', type: 'Water', hp: 100, imageUrl: 'https://images.pokemontcg.io/base1/6_hires.png', weight: 0.5 },
      { name: 'Alakazam (Holo)', cardNumber: '1/102', rarity: 'Holo Rare', type: 'Psychic', hp: 80, imageUrl: 'https://images.pokemontcg.io/base1/1_hires.png', weight: 0.5 },
      { name: 'Typhlosion (Holo)', cardNumber: '17/111', rarity: 'Holo Rare', type: 'Fire', hp: 100, imageUrl: 'https://images.pokemontcg.io/neo1/17_hires.png', weight: 0.5 },
      { name: 'Dialga (Holo)', cardNumber: '1/130', rarity: 'Holo Rare', type: 'Fighting', hp: 100, imageUrl: 'https://images.pokemontcg.io/dp1/1_hires.png', weight: 0.5 },
      { name: 'Palkia (Holo)', cardNumber: '11/130', rarity: 'Holo Rare', type: 'Water', hp: 90, imageUrl: 'https://images.pokemontcg.io/dp1/11_hires.png', weight: 0.5 },
      { name: 'Ho-Oh (Holo)', cardNumber: '7/64', rarity: 'Holo Rare', type: 'Fire', hp: 90, imageUrl: 'https://images.pokemontcg.io/neo3/7_hires.png', weight: 0.5 },
      { name: 'Rayquaza δ (Holo)', cardNumber: '16/110', rarity: 'Holo Rare', type: 'Electric', hp: 90, imageUrl: 'https://images.pokemontcg.io/ex6/97_hires.png', weight: 0.5 },
    ],
  },
];

async function main() {
  console.log('Seeding database with Pokémon TCG data...');

  // Clear all existing data
  await prisma.completedSet.deleteMany();
  await prisma.minigameAttempt.deleteMany();
  await prisma.userCard.deleteMany();
  await prisma.packOpening.deleteMany();
  await prisma.card.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pack.deleteMany();

  for (const packData of PACKS) {
    const pack = await prisma.pack.create({
      data: {
        name: packData.name,
        setName: packData.setName,
        description: packData.description,
        imageUrl: packData.imageUrl,
        cost: packData.cost,
        cardsPerPack: 3,
      },
    });

    for (const cardData of packData.cards) {
      await prisma.card.create({
        data: {
          packId: pack.id,
          name: cardData.name,
          cardNumber: cardData.cardNumber,
          rarity: cardData.rarity,
          type: cardData.type,
          hp: cardData.hp,
          imageUrl: cardData.imageUrl,
          weight: cardData.weight,
          vaultOnly: (cardData as any).vaultOnly || false,
        },
      });
    }

    console.log(`  ✓ ${packData.name} — ${packData.cards.length} cards`);
  }

  console.log('\nSeeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
