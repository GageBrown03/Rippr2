import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// Pokédex-style descriptions for generating clues
const POKEMON_HINTS: Record<string, string[]> = {
  // Base Set classics
  'Charizard': ['This Fire/Flying type breathes flames hot enough to melt boulders.', 'Its flame burns hotter when it has experienced harsh battles.', 'It flies around the sky seeking powerful opponents.'],
  'Blastoise': ['The water cannons on its shell can shoot jets of water precise enough to strike a target over 160 feet away.', 'This fully evolved Water starter towers over its trainer.', 'The pressurized water jets from its shell cannons can punch through thick steel.'],
  'Venusaur': ['The flower on its back blooms in sunlight, releasing a soothing scent.', 'This Grass/Poison type is the final evolution of the original Grass starter.', 'It can convert sunlight into energy, and the flower on its back becomes more vibrant.'],
  'Mewtwo': ['Created by genetic manipulation, this Psychic type is said to be the most powerful Pokémon.', 'A scientist genetically engineered this Pokémon from Mew\'s DNA.', 'It was created solely for battle and has the most savage heart among all Pokémon.'],
  'Pikachu': ['This Electric Mouse Pokémon stores electricity in its red cheek pouches.', 'When several of these Pokémon gather, their electricity can build and cause lightning storms.', 'It raises its tail to check its surroundings and is occasionally struck by lightning.'],
  'Gyarados': ['Once a weak fish Pokémon, it transformed into a ferocious flying serpent.', 'This Pokémon is known for its destructive rampages that can last a month.', 'In ancient times, it appeared during wars and destroyed everything in its path.'],
  'Alakazam': ['Its brain continually grows, making its head far too heavy for its body.', 'This Psychic type has an IQ of approximately 5,000.', 'It uses psychic power instead of physical strength, holding spoons that amplify its abilities.'],
  'Zapdos': ['This Legendary Bird appears when thunderclouds cover the sky.', 'It gains power when struck by lightning, and its wings crackle with electricity.', 'One of the three Legendary Birds of Kanto, it controls electricity.'],
  'Raichu': ['Its tail acts as a ground to protect itself from its own high-voltage power.', 'This evolved Electric Mouse can discharge over 100,000 volts.', 'If the electrical pouches in its cheeks become fully charged, both ears stand straight up.'],
  'Machamp': ['With four arms that can throw 500 punches per second, this Fighting type is unstoppable.', 'It is known to move mountains with one arm.', 'Its four arms allow it to pin down the limbs of its foe, then throw them over the horizon.'],
  'Nidoking': ['This Poison/Ground type is recognized by its large, powerful horn.', 'One swing of its thick tail can topple a metal transmission tower.', 'Its thick tail delivers destructive power, and a single swing can snap a telephone pole.'],
  'Dragonair': ['This serpentine Dragon type is said to live in seas and lakes, and can control weather.', 'Mystical energy emanates from its crystal orbs, giving it the ability to control the weather.', 'A gentle and mystical Pokémon that radiates energy from its crystalline orbs.'],
  // Evolving Skies / Modern
  'Umbreon VMAX': ['The Dark-type Eeveelution in its Dynamax form, with glowing ring patterns.', 'This moonlight Pokémon reaches its ultimate form through Dynamax energy.', 'Its golden rings glow ominously in the darkness when Dynamaxed.'],
  'Rayquaza VMAX': ['This Dragon/Flying Legendary reaches its ultimate Dynamax form in the ozone layer.', 'The sky-dwelling serpent of Hoenn in its most powerful Dynamax state.', 'It is said to have lived for hundreds of millions of years in the ozone layer.'],
  'Mew ex': ['Said to contain the DNA of every Pokémon, this Psychic type is extremely rare.', 'This Mythical Pokémon is so rare that many experts say it is only a mirage.', 'Its DNA is said to contain the genetic codes of all Pokémon.'],
  // Gen 2 / Neo
  'Lugia': ['The guardian of the seas, this Psychic/Flying Legendary sleeps in deep ocean trenches.', 'It is said that it quietly spends its time deep at the bottom of the sea because its powers are too strong.', 'Its wings pack devastating power — a light fluttering creates a 40-day storm.'],
  'Ho-Oh': ['A magnificent Fire/Flying bird whose feathers glow in seven colors.', 'It is said that a rainbow forms behind it when it flies, and those who see it are granted eternal happiness.', 'This Legendary bird is the guardian of the skies over the Johto region.'],
  'Typhlosion': ['Flames erupt from around its neck when it is angry, creating a shimmering heat haze.', 'The fully evolved Johto Fire starter with an explosive temper.', 'It obscures itself behind shimmering heat, creating a form of camouflage.'],
  'Feraligatr': ['This Water-type Johto starter has powerful jaws that can crush anything.', 'It opens its huge mouth to intimidate enemies, and bites down with enough force to crush boulders.', 'The final evolution of the Johto Water starter, known for its ferocious bite.'],
  'Meganium': ['The aroma that rises from its petals has a calming effect on those around it.', 'The Johto Grass starter in its final form, with a soothing floral scent.', 'Its breath has the power to revive dead grass and plants, and its scent calms aggressive feelings.'],
  // Diamond & Pearl
  'Dialga': ['This Steel/Dragon Legendary has the power to control time itself.', 'It is said that time began moving when this Pokémon was born.', 'A Legendary Pokémon of Sinnoh that is said to have created time.'],
  'Palkia': ['This Water/Dragon Legendary has the ability to distort space.', 'It is described in mythology as having the power to warp the fabric of space.', 'A Legendary Pokémon that is said to live in a gap in spatial dimensions.'],
  'Infernape': ['This Fire/Fighting type uses a special fighting style combining punches, kicks, and fire.', 'The crown of flame on its head is a symbol of its fiery nature — the Sinnoh Fire starter\'s final form.', 'It uses all its limbs when fighting, and its fire never goes out.'],
  // XY
  'Mega Charizard EX (Y)': ['The Y Mega Evolution of the iconic Fire starter transforms it into a Fire/Flying powerhouse.', 'When Mega Evolved through the Y stone, this dragon-like Pokémon gains incredible Special Attack.', 'Its Mega Evolution via Charizardite Y gives it the Drought ability.'],
  'Mega Charizard EX (X)': ['The X Mega Evolution transforms this Pokémon into a Fire/Dragon type with blue-black flames.', 'When Mega Evolved through the X stone, its flames burn blue and its type changes to include Dragon.', 'Charizardite X triggers a dark transformation with Tough Claws ability.'],
};

// Fallback: generate a hint from card data
function generateHint(card: { name: string; type: string; hp: number | null; rarity: string }): string {
  const baseName = card.name.replace(/ \(.*\)$/, '').replace(/ VMAX$/, '').replace(/ GX$/, '').replace(/ EX$/, '').replace(/ ex$/, '').replace(/ V$/, '').replace(/ δ$/, '').replace(/ LV\.X$/, '');
  const hints = POKEMON_HINTS[card.name] || POKEMON_HINTS[baseName];
  if (hints) {
    return hints[Math.floor(Math.random() * hints.length)];
  }
  // Generic fallback
  const typeHints: Record<string, string> = {
    Fire: 'This fiery creature harnesses the power of flames in battle.',
    Water: 'This aquatic creature commands the power of water.',
    Grass: 'This nature-loving creature draws strength from plants and sunlight.',
    Electric: 'This electrifying creature crackles with high-voltage energy.',
    Psychic: 'This mysterious creature possesses extraordinary mental powers.',
    Fighting: 'This powerful creature is a master of physical combat.',
    Dark: 'This shadowy creature thrives in darkness and uses cunning tactics.',
    Dragon: 'This rare and powerful creature is feared for its devastating strength.',
    Normal: 'This versatile creature adapts well to many situations.',
  };
  const typeHint = typeHints[card.type] || `This ${card.type}-type creature is a formidable opponent.`;
  const hpHint = card.hp ? ` With ${card.hp} HP, it can ${card.hp > 150 ? 'take tremendous punishment' : card.hp > 80 ? 'hold its own in battle' : 'be fragile but tricky'}.` : '';
  return `${typeHint}${hpHint} It is classified as ${card.rarity}.`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allCards = await prisma.card.findMany({
      select: {
        id: true, name: true, type: true, hp: true, rarity: true, imageUrl: true,
      },
    });

    if (allCards.length < 4) {
      return NextResponse.json({ error: 'Not enough cards available' }, { status: 404 });
    }

    // Pick a random card (prefer rares for more interesting questions)
    const rareCards = allCards.filter(c => c.rarity.includes('Rare'));
    const pool = rareCards.length > 0 ? rareCards : allCards;
    const correctCard = pool[Math.floor(Math.random() * pool.length)];

    // Generate hint
    const hint = generateHint(correctCard);

    // Build 4 options: the correct answer + 3 wrong ones
    // Strip suffixes for display so answers look clean
    function displayName(name: string): string {
      return name.replace(/ \(Alt\)$/, '').replace(/ \(Shiny\)$/, '').replace(/ \(SAR\)$/, '').replace(/ \(Holo\)$/, '').replace(/ \(Neo\)$/, '').replace(/ \(Base\)$/, '').replace(/ \(RR\)$/, '').replace(/ \(FA\)$/, '').replace(/ \(Full Art\)$/, '');
    }

    const correctDisplay = displayName(correctCard.name);

    // Pick 3 wrong answers from different names
    const wrongPool = allCards.filter(c => displayName(c.name) !== correctDisplay);
    const uniqueWrong = new Set<string>();
    const shuffled = [...wrongPool].sort(() => Math.random() - 0.5);
    for (const c of shuffled) {
      if (uniqueWrong.size >= 3) break;
      const dn = displayName(c.name);
      if (!uniqueWrong.has(dn)) uniqueWrong.add(dn);
    }

    const options = [correctDisplay, ...Array.from(uniqueWrong)].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      cardId: correctCard.id,
      hint,
      type: correctCard.type,
      correctName: correctDisplay,
      options,
      startTime: Date.now(),
    });
  } catch (error) {
    console.error('Error generating guess challenge:', error);
    return NextResponse.json({ error: 'Failed to generate challenge' }, { status: 500 });
  }
}
