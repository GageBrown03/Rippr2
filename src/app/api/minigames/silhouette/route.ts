import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { generateMultipleChoiceOptions } from '@/lib/minigame-engine';

// Map base Pokemon names to PokeAPI IDs for official artwork silhouettes
const POKEMON_IDS: Record<string, number> = {
  bulbasaur: 1, ivysaur: 2, venusaur: 3, charmander: 4, charmeleon: 5,
  charizard: 6, squirtle: 7, wartortle: 8, blastoise: 9, caterpie: 10,
  metapod: 11, pikachu: 25, raichu: 26, sandshrew: 27, nidoking: 34,
  clefairy: 35, ninetales: 38, diglett: 50, mewtwo: 150, mew: 151,
  machop: 66, machoke: 67, machamp: 68, gastly: 92, haunter: 93,
  gengar: 94, onix: 95, drowzee: 96, alakazam: 65, kadabra: 64, abra: 63,
  ponyta: 77, magnemite: 81, magneton: 82, doduo: 84, dewgong: 87,
  koffing: 109, chansey: 113, gyarados: 130, magikarp: 129, pidgey: 17,
  pidgeotto: 18, rattata: 19, raticate: 20, dragonair: 148, dragonite: 149,
  electabuzz: 125, electrode: 101, hitmonchan: 107, poliwag: 60, poliwhirl: 61,
  poliwrath: 62, beedrill: 15, zapdos: 145, arcanine: 59, growlithe: 58,
  jynx: 124, kakuna: 14, magmar: 126, nidorino: 33, porygon: 137,
  seel: 86, dratini: 147, pichu: 172, eevee: 133, umbreon: 197,
  espeon: 196, glaceon: 471, leafeon: 470, sylveon: 700, flareon: 136,
  jolteon: 135, vaporeon: 134, rayquaza: 384, absol: 359, flygon: 330,
  lugia: 249, typhlosion: 157, feraligatr: 160, meganium: 154,
  togetic: 176, heracross: 214, kingdra: 230, ampharos: 181,
  steelix: 208, murkrow: 198, donphan: 232, skarmory: 227,
  quilava: 156, croconaw: 159, bayleef: 153, flaaffy: 180,
  sunflora: 192, cyndaquil: 155, totodile: 158, chikorita: 152,
  mareep: 179, sentret: 161, marill: 183, sunkern: 191, hoothoot: 163,
  dialga: 483, palkia: 484, infernape: 392, empoleon: 395, torterra: 389,
  luxray: 405, roserade: 407, staraptor: 398, munchlax: 446,
  floatzel: 419, drapion: 452, monferno: 391, prinplup: 394,
  grotle: 388, luxio: 404, staravia: 397, chimchar: 390, piplup: 393,
  turtwig: 387, shinx: 403, starly: 396, bidoof: 399, budew: 406,
  buizel: 418, treecko: 252, torchic: 255, mudkip: 258,
  altaria: 334, swablu: 333, noibat: 714, shroomish: 285, trapinch: 328,
  wooloo: 831, froakie: 656, frogadier: 657, fennekin: 653,
  braixen: 654, chespin: 650, quilladin: 651, fletchling: 661,
  honedge: 679, doublade: 680, aegislash: 681, bunnelby: 659,
  litleo: 667, skiddo: 672, aromatisse: 683, trevenant: 709,
  snorlax: 143, horsea: 116, seadra: 117,
  psyduck: 54, geodude: 74, ekans: 23, voltorb: 100, weezing: 110,
  staryu: 120, starmie: 121, togekiss: 468, ho_oh: 250,
  // Deltas and special forms still map to base pokemon
  pidgeot: 18, kabuto: 140, kabutops: 141, omanyte: 138, omastar: 139,
  latios: 381, cradily: 346, armaldo: 348, vibrava: 329, lileep: 345,
  anorith: 347,
};

function getPokeApiId(cardName: string): number | null {
  // Strip suffixes to get base name
  const base = cardName
    .replace(/ \(.*\)$/i, '')
    .replace(/ VMAX$/i, '')
    .replace(/ GX$/i, '')
    .replace(/ EX$/i, '')
    .replace(/ ex$/i, '')
    .replace(/ V$/i, '')
    .replace(/ δ$/i, '')
    .replace(/ LV\.X$/i, '')
    .replace(/^Mega /i, '')
    .replace(/^M /i, '')
    .replace(/^Dark /i, '')
    .replace(/'s .*/i, '') // "Brock's Geodude" -> strip
    .replace(/ ?♂| ?♀/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // Direct lookup
  if (POKEMON_IDS[base]) return POKEMON_IDS[base];

  // Try without underscores
  const noUnderscore = base.replace(/_/g, '');
  for (const [key, id] of Object.entries(POKEMON_IDS)) {
    if (key.replace(/_/g, '') === noUnderscore) return id;
  }

  // Try first word only (e.g. "nidoran m" -> "nidoran")
  const firstWord = base.split('_')[0];
  if (POKEMON_IDS[firstWord]) return POKEMON_IDS[firstWord];

  return null;
}

function getArtworkUrl(pokeId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }

    // Get all cards that have a valid PokeAPI mapping
    const allCards = await prisma.card.findMany();

    if (allCards.length === 0) {
      return NextResponse.json({ success: false, error: 'No cards available' }, { status: 404 });
    }

    // Filter to cards we can generate silhouettes for
    const mappableCards = allCards.filter((c) => getPokeApiId(c.name) !== null);

    if (mappableCards.length < 4) {
      return NextResponse.json({ success: false, error: 'Not enough cards for silhouette game' }, { status: 404 });
    }

    // Pick a random card (prefer rares)
    const rareCards = mappableCards.filter((c) => c.rarity.includes('Rare'));
    const pool = rareCards.length >= 4 ? rareCards : mappableCards;
    const selectedCard = pool[Math.floor(Math.random() * pool.length)];

    const pokeId = getPokeApiId(selectedCard.name)!;
    const artworkUrl = getArtworkUrl(pokeId);

    // Generate options with clean display names (strip suffixes)
    function cleanName(name: string): string {
      return name
        .replace(/ \(SAR\)$/i, '').replace(/ \(Alt\)$/i, '').replace(/ \(Holo\)$/i, '')
        .replace(/ \(Shiny\)$/i, '').replace(/ \(Neo\)$/i, '').replace(/ \(Base\)$/i, '')
        .replace(/ \(RR\)$/i, '').replace(/ \(FA\)$/i, '').replace(/ \(Full Art\)$/i, '')
        .replace(/ \(Vault.*\)$/i, '').replace(/ VMAX$/i, '').replace(/ GX$/i, '')
        .replace(/ EX$/i, '').replace(/ ex$/i, '').replace(/ V$/i, '')
        .replace(/ δ$/i, '').replace(/ LV\.X$/i, '').replace(/^Mega /i, '')
        .replace(/^M /i, '').replace(/^Dark /i, '').replace(/^Shiny /i, '')
        .replace(/^Shining /i, '').replace(/^Gold Star /i, '')
        .trim();
    }

    const rawOptions = generateMultipleChoiceOptions(selectedCard, mappableCards, 4);
    const correctClean = cleanName(selectedCard.name);

    // Clean all options, ensure correct answer is present and unique
    const cleanedSet = new Set<string>();
    cleanedSet.add(correctClean);
    for (const opt of rawOptions) {
      const c = cleanName(opt);
      if (c !== correctClean) cleanedSet.add(c);
    }
    // If we lost options due to dedup, add more from pool
    if (cleanedSet.size < 4) {
      const shuffled = [...mappableCards].sort(() => Math.random() - 0.5);
      for (const card of shuffled) {
        if (cleanedSet.size >= 4) break;
        const c = cleanName(card.name);
        if (!cleanedSet.has(c)) cleanedSet.add(c);
      }
    }
    const options = Array.from(cleanedSet).slice(0, 4).sort(() => Math.random() - 0.5);

    return NextResponse.json({
      success: true,
      data: {
        cardId: selectedCard.id,
        cardName: selectedCard.name,
        correctName: correctClean,
        imageUrl: artworkUrl,
        cardImageUrl: selectedCard.imageUrl,
        options,
        startTime: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error generating silhouette challenge:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate challenge' }, { status: 500 });
  }
}
