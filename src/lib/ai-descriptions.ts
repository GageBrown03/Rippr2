import Anthropic from '@anthropic-ai/sdk';
import logger from '@/lib/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateCardDescription(cardName: string, cardType: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Generate a 2-sentence Pokémon card flavor text for ${cardName}, a ${cardType} type card. Be creative and evocative, matching the style of official Pokémon card flavor text. Return only the flavor text, nothing else.`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text;
    }
    return 'A mysterious Pokémon with untold power.';
  } catch (error) {
    logger.error('Failed to generate AI description', { error, cardName, cardType });
    return 'A mysterious Pokémon with untold power.';
  }
}