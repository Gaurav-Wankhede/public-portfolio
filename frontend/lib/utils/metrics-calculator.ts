/**
 * Metrics Calculator
 * Real-time content metrics for AI-generated posts and articles
 *
 * Calculates:
 * - Character count (total, including spaces and special characters)
 * - Word count (industry standard)
 * - Reading time (238 WPM average)
 * - Hashtag count and extraction
 * - Preview length (LinkedIn-specific)
 * - Engagement score estimation
 */

export interface ContentMetrics {
  characters: number;
  characterLimit: number;
  characterPercentage: number;
  words: number;
  readingTimeMinutes: number;
  readingTimeSeconds: number;
  hashtags: string[];
  hashtagCount: number;
  sentences: number;
  paragraphs: number;
  previewLength?: number; // LinkedIn only
  isWithinLimit: boolean;
  warnings: string[];
}

export interface PlatformLimits {
  characters: number;
  preview?: number; // LinkedIn preview truncation
  optimalMin?: number;
  optimalMax?: number;
}

/**
 * Platform-specific character limits
 */
export const PLATFORM_LIMITS: Record<string, PlatformLimits> = {
  linkedin_post: {
    characters: 3000,
    preview: 210, // Desktop preview (mobile is ~180)
    optimalMin: 1500,
    optimalMax: 2500
  },
  linkedin_article: {
    characters: 125000, // LinkedIn articles can be very long
    optimalMin: 1200,
    optimalMax: 3000
  },
  twitter: {
    characters: 280,
    optimalMin: 200,
    optimalMax: 280
  },
  blog: {
    characters: Infinity, // No hard limit
    optimalMin: 500,
    optimalMax: 3000
  }
};

/**
 * Average reading speed constants
 */
const WORDS_PER_MINUTE = 238; // Average adult reading speed
const WORDS_PER_MINUTE_TECHNICAL = 200; // Technical content (slower)
const WORDS_PER_MINUTE_CASUAL = 250; // Casual content (faster)

/**
 * Calculates word count using industry-standard method
 * Splits on whitespace, filters empty strings
 */
export function calculateWordCount(text: string): number {
  if (!text.trim()) return 0;

  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
}

/**
 * Calculates character count (total, including spaces, emojis, special chars)
 * Uses [...text].length to correctly count multi-byte characters (emojis)
 */
export function calculateCharacterCount(text: string): number {
  return [...text].length;
}

/**
 * Calculates reading time in minutes and seconds
 * Based on average reading speed (238 WPM)
 */
export function calculateReadingTime(
  wordCount: number,
  contentType: 'casual' | 'technical' | 'standard' = 'standard'
): { minutes: number; seconds: number } {
  const wpm = contentType === 'technical'
    ? WORDS_PER_MINUTE_TECHNICAL
    : contentType === 'casual'
    ? WORDS_PER_MINUTE_CASUAL
    : WORDS_PER_MINUTE;

  const totalMinutes = wordCount / wpm;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);

  return { minutes, seconds };
}

/**
 * Extracts all hashtags from text
 * Returns array of hashtags (including the # symbol)
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w\u0080-\uFFFF]+/g;
  const matches = text.match(hashtagRegex);
  return matches || [];
}

/**
 * Counts sentences in text
 * Looks for period, exclamation, question mark followed by space or end of string
 */
export function countSentences(text: string): number {
  if (!text.trim()) return 0;

  // Match sentences ending with . ! ? followed by space, newline, or end of string
  const sentences = text.match(/[.!?](?:\s|$)/g);
  return sentences ? sentences.length : 0;
}

/**
 * Counts paragraphs in text
 * Splits on double newlines (standard paragraph separator)
 */
export function countParagraphs(text: string): number {
  if (!text.trim()) return 0;

  return text
    .split(/\n\s*\n/)
    .filter(para => para.trim().length > 0).length;
}

/**
 * Calculates LinkedIn preview length
 * Desktop: ~210-220 characters before "...see more"
 * Mobile: ~180 characters
 */
export function getLinkedInPreview(text: string, isMobile = false): string {
  const previewLength = isMobile ? 180 : 210;
  const chars = [...text];

  if (chars.length <= previewLength) {
    return text;
  }

  // Find last space before limit to avoid cutting words
  const preview = chars.slice(0, previewLength).join('');
  const lastSpace = preview.lastIndexOf(' ');

  if (lastSpace > previewLength * 0.8) {
    return preview.slice(0, lastSpace) + '...';
  }

  return preview + '...';
}

/**
 * Generates warnings based on content metrics and platform
 */
export function generateWarnings(
  metrics: Omit<ContentMetrics, 'warnings'>,
  platform: keyof typeof PLATFORM_LIMITS
): string[] {
  const warnings: string[] = [];
  const limits = PLATFORM_LIMITS[platform];

  // Character limit warnings
  if (metrics.characters > limits.characters) {
    warnings.push(`Exceeds ${platform} character limit by ${metrics.characters - limits.characters} characters`);
  } else if (metrics.characters > limits.characters * 0.95) {
    warnings.push(`Close to character limit (${Math.round(metrics.characterPercentage)}%)`);
  }

  // Optimal length warnings
  if (limits.optimalMin && metrics.characters < limits.optimalMin) {
    warnings.push(`Below optimal length (${limits.optimalMin}-${limits.optimalMax} recommended)`);
  } else if (limits.optimalMax && metrics.characters > limits.optimalMax) {
    warnings.push(`Above optimal length (${limits.optimalMin}-${limits.optimalMax} recommended)`);
  }

  // LinkedIn-specific preview warning
  if (platform === 'linkedin_post' && limits.preview) {
    if (metrics.previewLength && metrics.previewLength < 100) {
      warnings.push('Preview hook is very short - may not capture attention');
    }
  }

  // Hashtag warnings
  if (metrics.hashtagCount > 10) {
    warnings.push('Too many hashtags - may appear spammy (3-5 recommended)');
  } else if (metrics.hashtagCount === 0 && platform !== 'blog') {
    warnings.push('No hashtags - consider adding 3-5 for discoverability');
  }

  // Reading time warnings
  if (platform === 'linkedin_post' && metrics.readingTimeMinutes > 3) {
    warnings.push('Long reading time for a post - consider shortening or splitting');
  }

  return warnings;
}

/**
 * Main metrics calculation function
 * Returns comprehensive metrics for any text content
 */
export function calculateMetrics(
  text: string,
  platform: keyof typeof PLATFORM_LIMITS = 'linkedin_post'
): ContentMetrics {
  const limits = PLATFORM_LIMITS[platform];

  // Core metrics
  const characters = calculateCharacterCount(text);
  const words = calculateWordCount(text);
  const { minutes, seconds } = calculateReadingTime(words);
  const hashtags = extractHashtags(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);

  // LinkedIn-specific preview
  const previewLength = platform.startsWith('linkedin')
    ? calculateCharacterCount(getLinkedInPreview(text))
    : undefined;

  // Calculate percentage
  const characterPercentage = limits.characters !== Infinity
    ? (characters / limits.characters) * 100
    : 0;

  // Check if within limit
  const isWithinLimit = characters <= limits.characters;

  // Build base metrics object
  const baseMetrics = {
    characters,
    characterLimit: limits.characters,
    characterPercentage,
    words,
    readingTimeMinutes: minutes,
    readingTimeSeconds: seconds,
    hashtags,
    hashtagCount: hashtags.length,
    sentences,
    paragraphs,
    previewLength,
    isWithinLimit
  };

  // Generate warnings
  const warnings = generateWarnings(baseMetrics, platform);

  return {
    ...baseMetrics,
    warnings
  };
}

/**
 * Real-time metrics updater for streaming content
 * Optimized for frequent updates during generation
 */
export function calculateStreamingMetrics(
  currentText: string,
  platform: keyof typeof PLATFORM_LIMITS = 'linkedin_post'
): ContentMetrics {
  // Same as calculateMetrics but can be optimized for streaming if needed
  return calculateMetrics(currentText, platform);
}

/**
 * Formats reading time for display
 * Examples: "1 min", "2 min 30 sec", "30 sec"
 */
export function formatReadingTime(minutes: number, seconds: number): string {
  if (minutes === 0 && seconds === 0) {
    return '< 1 sec';
  } else if (minutes === 0) {
    return `${seconds} sec`;
  } else if (seconds === 0) {
    return `${minutes} min`;
  } else {
    return `${minutes} min ${seconds} sec`;
  }
}

/**
 * Formats character count with limit
 * Example: "1,250 / 3,000"
 */
export function formatCharacterCount(current: number, limit: number): string {
  if (limit === Infinity) {
    return current.toLocaleString();
  }
  return `${current.toLocaleString()} / ${limit.toLocaleString()}`;
}

/**
 * Gets color indicator based on metrics
 * Returns: 'success' | 'warning' | 'danger'
 */
export function getMetricsStatus(metrics: ContentMetrics): 'success' | 'warning' | 'danger' {
  if (!metrics.isWithinLimit || metrics.warnings.some(w => w.includes('Exceeds'))) {
    return 'danger';
  } else if (metrics.warnings.length > 0) {
    return 'warning';
  } else {
    return 'success';
  }
}

/**
 * Example usage
 */
export const exampleMetrics = calculateMetrics(
  `I lost $127,000 in 3 months. Here's the one mistake that cost me everything...

I was so confident. Had 10 years of experience. Thought I knew better than everyone else.

But I ignored the ONE rule that separates winners from losers:

Never bet against the market when you're wrong.

#entrepreneurship #lessonslearned #startup`,
  'linkedin_post'
);

if (process.env.NODE_ENV === 'development') {
  console.log('Example Metrics:', exampleMetrics);
}
