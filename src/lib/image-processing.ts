/**
 * Image processing utilities for the silhouette minigame
 * These functions generate CSS filters to create silhouettes and blurred effects
 */

export interface ImageEffect {
  filter: string;
  transform?: string;
}

/**
 * Generate a silhouette effect (black shape)
 */
export function getSilhouetteEffect(): ImageEffect {
  return {
    filter: 'brightness(0) saturate(100%)',
  };
}

/**
 * Generate a blur effect with optional intensity
 */
export function getBlurEffect(intensity: number = 20): ImageEffect {
  return {
    filter: `blur(${intensity}px)`,
  };
}

/**
 * Generate a combined effect (silhouette + slight glow)
 */
export function getEnhancedSilhouetteEffect(): ImageEffect {
  return {
    filter: 'brightness(0) saturate(100%) drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))',
  };
}

/**
 * Get effect based on difficulty
 */
export function getEffectByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ImageEffect {
  switch (difficulty) {
    case 'easy':
      return getBlurEffect(15);
    case 'medium':
      return getBlurEffect(25);
    case 'hard':
      return getSilhouetteEffect();
    default:
      return getSilhouetteEffect();
  }
}

/**
 * Apply CSS filter string to an image element
 */
export function applyImageEffect(element: HTMLImageElement, effect: ImageEffect): void {
  if (effect.filter) {
    element.style.filter = effect.filter;
  }
  if (effect.transform) {
    element.style.transform = effect.transform;
  }
}

/**
 * Remove all effects from an image element
 */
export function removeImageEffect(element: HTMLImageElement): void {
  element.style.filter = '';
  element.style.transform = '';
}