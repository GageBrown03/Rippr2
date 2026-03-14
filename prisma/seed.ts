import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const POKEMON_TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Dark', 'Steel', 'Fairy', 'Dragon', 'Normal', 'Ice', 'Ghost', 'Poison'];

const PACKS = [
  { name: 'Base Set', setName: 'Base Set', description: 'The original Pokémon card set that started it all!', cost: 200, imageUrl: 'https://via.placeholder.com/300x400?text=Base+Set' },
  { name: 'Jungle', setName: 'Jungle', description: 'Explore the wild jungle and discover rare Pokémon!', cost: 200, imageUrl: 'https://via.placeholder.com/300x400?text=Jungle' },
  { name: 'Fossil', setName: 'Fossil', description: 'Unearth ancient Pokémon from the depths of time!', cost: 250, imageUrl: 'https://via.placeholder.com/300x400?text=Fossil' },
  { name: 'Team Rocket', setName: 'Team Rocket', description: 'Dark Pokémon from the nefarious Team Rocket!', cost: 300, imageUrl: 'https://via.placeholder.com/300x400?text=Team+Rocket' },
  { name: 'Gym Heroes', setName: 'Gym Heroes', description: 'Battle alongside Gym Leaders and their signature Pokémon!', cost: 350, imageUrl: 'https://via.placeholder.com/300x400?text=Gym+Heroes' },
];

const POKEMON_NAMES: Record<string, string[]> = {
  'Base Set': [
    'Charizard', 'Blastoise', 'Venusaur', 'Pikachu', 'Mewtwo', 'Alakazam', 'Gyarados', 'Ninetales', 'Poliwrath', 'Hitmonchan',
    'Machamp', 'Nidoking', 'Clefairy', 'Chansey', 'Raichu', 'Magneton', 'Electrode', 'Arcanine', 'Dewgong', 'Pidgeotto',
    'Raticate', 'Fearow', 'Sandslash', 'Nidorina', 'Nidorino', 'Vulpix', 'Jigglypuff', 'Zubat', 'Gloom', 'Parasect',
    'Venomoth', 'Dugtrio', 'Primeape', 'Growlithe', 'Poliwhirl', 'Abra', 'Kadabra', 'Machop', 'Machoke', 'Bellsprout',
    'Weepinbell', 'Tentacool', 'Geodude', 'Graveler', 'Ponyta', 'Rapidash', 'Slowpoke', 'Magnemite', 'Farfetchd', 'Doduo',
    'Seel', 'Grimer', 'Gastly', 'Haunter', 'Drowzee', 'Krabby', 'Voltorb', 'Exeggcute', 'Cubone', 'Marowak',
    'Tangela', 'Horsea', 'Goldeen', 'Staryu', 'Starmie', 'Magikarp', 'Ditto', 'Eevee', 'Porygon', 'Omanyte',
    'Kabuto', 'Snorlax', 'Dratini', 'Dragonair', 'Dragonite', 'Bulbasaur', 'Charmander', 'Squirtle', 'Caterpie', 'Weedle'
  ],
  'Jungle': [
    'Flareon', 'Jolteon', 'Vaporeon', 'Kangaskhan', 'Mr. Mime', 'Pinsir', 'Scyther', 'Snorlax', 'Vileplume', 'Victreebel',
    'Wigglytuff', 'Clefable', 'Electrode', 'Exeggutor', 'Nidoqueen', 'Pidgeot', 'Persian', 'Primeape', 'Rapidash', 'Rhydon',
    'Seaking', 'Tauros', 'Venomoth', 'Butterfree', 'Dodrio', 'Fearow', 'Gloom', 'Lickitung', 'Marowak', 'Nidorina',
    'Parasect', 'Pikachu', 'Rhyhorn', 'Bellsprout', 'Cubone', 'Eevee', 'Exeggcute', 'Goldeen', 'Jigglypuff', 'Mankey',
    'Meowth', 'Nidoran F', 'Nidoran M', 'Oddish', 'Paras', 'Pikachu', 'Ponyta', 'Spearow', 'Venonat', 'Vulpix',
    'Abra', 'Drowzee', 'Gastly', 'Geodude', 'Grimer', 'Horsea', 'Krabby', 'Magikarp', 'Poliwag', 'Slowpoke',
    'Staryu', 'Tentacool', 'Voltorb', 'Zubat', 'Caterpie', 'Weedle', 'Pidgey', 'Rattata', 'Sandshrew', 'Diglett',
    'Machop', 'Tentacruel', 'Magneton', 'Dewgong', 'Cloyster', 'Gengar', 'Hypno', 'Kingler', 'Starmie', 'Ditto'
  ],
  'Fossil': [
    'Aerodactyl', 'Articuno', 'Dragonite', 'Gengar', 'Haunter', 'Hitmonlee', 'Hypno', 'Kabutops', 'Lapras', 'Magneton',
    'Moltres', 'Muk', 'Omastar', 'Raichu', 'Zapdos', 'Arbok', 'Cloyster', 'Gastly', 'Golbat', 'Golduck',
    'Golem', 'Graveler', 'Kingler', 'Magmar', 'Omastar', 'Sandslash', 'Seadra', 'Slowbro', 'Tentacruel', 'Weezing',
    'Ekans', 'Geodude', 'Grimer', 'Horsea', 'Kabuto', 'Krabby', 'Omanyte', 'Psyduck', 'Shellder', 'Slowpoke',
    'Tentacool', 'Voltorb', 'Zubat', 'Ditto', 'Eevee', 'Exeggcute', 'Cubone', 'Drowzee', 'Gastly', 'Geodude',
    'Grimer', 'Horsea', 'Krabby', 'Magikarp', 'Poliwag', 'Slowpoke', 'Staryu', 'Tentacool', 'Voltorb', 'Zubat',
    'Pidgey', 'Rattata', 'Sandshrew', 'Diglett', 'Machop', 'Ponyta', 'Seel', 'Doduo', 'Farfetchd', 'Lickitung',
    'Chansey', 'Kangaskhan', 'Mr. Mime', 'Jynx', 'Electabuzz', 'Pinsir', 'Tauros', 'Porygon', 'Snorlax', 'Dratini'
  ],
  'Team Rocket': [
    'Dark Charizard', 'Dark Blastoise', 'Dark Dragonite', 'Dark Alakazam', 'Dark Arbok', 'Dark Dugtrio', 'Dark Golbat', 'Dark Gyarados', 'Dark Hypno', 'Dark Machamp',
    'Dark Magneton', 'Dark Slowbro', 'Dark Vileplume', 'Dark Weezing', 'Rockets Sneak Attack', 'Dark Charmeleon', 'Dark Dragonair', 'Dark Electrode', 'Dark Flareon', 'Dark Gloom',
    'Dark Golduck', 'Dark Jolteon', 'Dark Kadabra', 'Dark Machoke', 'Dark Muk', 'Dark Persian', 'Dark Primeape', 'Dark Rapidash', 'Dark Vaporeon', 'Dark Wartortle',
    'Abra', 'Charmander', 'Dark Raticate', 'Diglett', 'Dratini', 'Drowzee', 'Eevee', 'Ekans', 'Grimer', 'Koffing',
    'Machop', 'Magikarp', 'Mankey', 'Meowth', 'Oddish', 'Ponyta', 'Psyduck', 'Rattata', 'Slowpoke', 'Squirtle',
    'Voltorb', 'Vulpix', 'Zubat', 'Bulbasaur', 'Caterpie', 'Cubone', 'Gastly', 'Geodude', 'Goldeen', 'Horsea',
    'Jigglypuff', 'Krabby', 'Nidoran F', 'Nidoran M', 'Paras', 'Pidgey', 'Pikachu', 'Poliwag', 'Sandshrew', 'Seel',
    'Shellder', 'Spearow', 'Staryu', 'Tentacool', 'Venonat', 'Weedle', 'Dark Ninetales', 'Dark Raichu', 'Dark Venusaur', 'Dark Gengar'
  ],
  'Gym Heroes': [
    "Blaine's Moltres", "Erika's Venusaur", "Lt. Surge's Electabuzz", "Misty's Tentacruel", "Rocket's Hitmonchan", "Brock's Rhydon", "Erika's Clefable", "Lt. Surge's Fearow", "Misty's Goldeen", "Misty's Starmie",
    "Rocket's Scyther", "Sabrina's Gengar", "Blaine's Arcanine", "Brock's Golem", "Brock's Onix", "Erika's Dragonair", "Erika's Vileplume", "Lt. Surge's Magneton", "Misty's Cloyster", "Misty's Golduck",
    "Misty's Poliwrath", "Rocket's Mewtwo", "Sabrina's Alakazam", "Blaine's Charizard", "Brock's Sandslash", "Erika's Gloom", "Erika's Oddish", "Erika's Weepinbell", "Lt. Surge's Pikachu", "Lt. Surge's Voltorb",
    "Misty's Horsea", "Misty's Poliwag", "Misty's Psyduck", "Misty's Seel", "Misty's Staryu", "Brock's Geodude", "Brock's Mankey", "Brock's Vulpix", "Brock's Zubat", "Blaine's Growlithe",
    "Blaine's Ponyta", "Blaine's Vulpix", "Blaine's Charmander", "Blaine's Charmeleon", "Sabrina's Abra", "Sabrina's Drowzee", "Sabrina's Gastly", "Sabrina's Haunter", "Sabrina's Kadabra", "Sabrina's Mr. Mime",
    "Rocket's Grimer", "Rocket's Koffing", "Rocket's Meowth", "Rocket's Ekans", "Rocket's Oddish", "Rocket's Zubat", "Lt. Surge's Rattata", "Lt. Surge's Spearow", "Erika's Bellsprout", "Erika's Tangela",
    "Brock's Diglett", "Brock's Graveler", "Misty's Tentacool", "Misty's Magikarp", "Blaine's Magmar", "Blaine's Rapidash", "Sabrina's Jynx", "Sabrina's Slowbro", "Rocket's Machop", "Rocket's Cubone",
    "Lt. Surge's Electrode", "Erika's Exeggcute", "Brock's Primeape", "Misty's Dewgong", "Blaine's Ninetales", "Sabrina's Hypno", "Rocket's Golbat", "Rocket's Muk", "Lt. Surge's Raichu", "Erika's Exeggutor"
  ],
};

interface RarityConfig {
  rarity: string;
  count: number;
  weight: number;
}

const RARITY_DISTRIBUTION: RarityConfig[] = [
  { rarity: 'Common', count: 50, weight: 1.0 },
  { rarity: 'Uncommon', count: 20, weight: 0.4 },
  { rarity: 'Rare', count: 7, weight: 0.15 },
  { rarity: 'Holo Rare', count: 2, weight: 0.05 },
  { rarity: 'Ultra Rare', count: 1, weight: 0.01 },
];

function getRandomType(): string {
  return POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
}

function getRandomHp(rarity: string): number {
  const baseHp: Record<string, [number, number]> = {
    'Common': [30, 70],
    'Uncommon': [50, 90],
    'Rare': [70, 120],
    'Holo Rare': [90, 150],
    'Ultra Rare': [120, 200],
  };
  const [min, max] = baseHp[rarity] || [40, 80];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Seeding database...');

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
        cardsPerPack: 11,
      },
    });

    const pokemonNames = POKEMON_NAMES[packData.name] || [];
    let cardIndex = 0;

    for (const rarityConfig of RARITY_DISTRIBUTION) {
      for (let i = 0; i < rarityConfig.count; i++) {
        const name = pokemonNames[cardIndex % pokemonNames.length];
        const type = getRandomType();
        const hp = getRandomHp(rarityConfig.rarity);
        const cardNumber = `${packData.setName.replace(/\s/g, '')}-${String(cardIndex + 1).padStart(3, '0')}`;

        await prisma.card.create({
          data: {
            packId: pack.id,
            name,
            cardNumber,
            rarity: rarityConfig.rarity,
            type,
            hp,
            imageUrl: `https://via.placeholder.com/200x280?text=${encodeURIComponent(name)}`,
            weight: rarityConfig.weight,
          },
        });

        cardIndex++;
      }
    }

    console.log(`Seeded pack: ${packData.name} with ${cardIndex} cards`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
