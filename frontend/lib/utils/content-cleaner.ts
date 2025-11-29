/**
 * Content Cleaner
 * Removes preamble, meta-commentary, and other garbage text from AI-generated content
 */

/**
 * Common preamble patterns that AI models add before the actual content
 */
const PREAMBLE_PATTERNS = [
  /^.*?(?:here'?s|here is|i'?ve crafted|i created|i'?ve created|i'?ve generated|i generated|check out|below is|this is|try this).*?(?:post|content|version|draft|text).*?[:：]\s*/gims,
  /^.*?(?:let me|i'?ll|i will).*?(?:write|create|generate|craft).*?(?:post|content).*?[:：]\s*/gims,
  /^.*?(?:linkedin post|post for linkedin|your linkedin post|the linkedin post).*?[:：]\s*/gims,
  /^.*?(?:based on|considering|given|using).*?(?:your|the).*?(?:input|answers|information).*?[:：]\s*/gims,
  /^here you go.*?[:：\n]/gims,
  /^perfect.*?[:：\n]/gims,
  /^certainly.*?[:：\n]/gims,
  /^of course.*?[:：\n]/gims,
  /^absolutely.*?[:：\n]/gims,
  /^sure.*?[:：\n]/gims,
  /^okay.*?[:：\n]/gims,
  /^great.*?[:：\n]/gims,
];

/**
 * Patterns for markdown code blocks that shouldn't be in the final output
 */
const CODE_BLOCK_PATTERNS = [
  /^```(?:markdown|md|text)?\s*/gim,
  /```\s*$/gim,
];

/**
 * Meta-commentary patterns that appear after the content
 */
const POSTAMBLE_PATTERNS = [
  /\n\n---+\s*$/gim,
  /\n\nNote:.*$/gims,
  /\n\nRemember:.*$/gims,
  /\n\nTip:.*$/gims,
  /\n\nFeel free.*$/gims,
  /\n\nLet me know.*$/gims,
  /\n\nIf you (?:need|want|would like).*$/gims,
];

/**
 * Removes preamble text that AI models often add before the actual content
 *
 * Examples of preamble:
 * - "Here's your LinkedIn post:"
 * - "I've crafted this post for you:"
 * - "Based on your answers, here's the content:"
 *
 * @param content - The AI-generated content with potential preamble
 * @returns Content with preamble removed
 */
export function removePreamble(content: string): string {
  let cleaned = content;

  // Try each preamble pattern
  for (const pattern of PREAMBLE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

/**
 * Removes markdown code block syntax (```markdown, ```)
 * AI models sometimes wrap content in code blocks
 *
 * @param content - Content that may contain code block syntax
 * @returns Content without code block markers
 */
export function removeCodeBlocks(content: string): string {
  let cleaned = content;

  for (const pattern of CODE_BLOCK_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

/**
 * Removes meta-commentary and postamble text after the main content
 *
 * Examples:
 * - "Note: You can customize this further..."
 * - "Feel free to adjust the tone..."
 * - "Let me know if you need any changes..."
 *
 * @param content - Content that may have postamble
 * @returns Content without postamble
 */
export function removePostamble(content: string): string {
  let cleaned = content;

  for (const pattern of POSTAMBLE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

/**
 * Extracts only the actual LinkedIn post content
 * Looks for patterns that indicate the start of real content:
 * - Unicode bold characters (𝗕𝗼𝗹𝗱)
 * - Strong opening hooks (common in LinkedIn posts)
 * - Paragraph-style content
 *
 * @param content - Raw AI output
 * @returns Extracted post content
 */
export function extractPostContent(content: string): string {
  // First, remove code blocks
  let cleaned = removeCodeBlocks(content);

  // Then remove preamble
  cleaned = removePreamble(cleaned);

  // Remove postamble
  cleaned = removePostamble(cleaned);

  // Split into lines and find where actual content starts
  const lines = cleaned.split('\n');
  let startIndex = 0;

  // Look for the first line that looks like actual post content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Check if this looks like real content:
    // 1. Contains Unicode bold characters (𝗕𝗼𝗹𝗱)
    // 2. Is longer than 20 characters and not a meta instruction
    // 3. Doesn't start with common preamble phrases
    const hasUnicodeBold = /[\u{1D5D4}-\u{1D5F3}\u{1D5EE}-\u{1D607}]/u.test(line);
    const isSubstantial = line.length > 20;
    const isPreamble = /^(?:here|i've|i'll|based on|considering|note:|tip:|remember:)/i.test(line);

    if ((hasUnicodeBold || isSubstantial) && !isPreamble) {
      startIndex = i;
      break;
    }
  }

  // Rejoin from the start index
  const finalContent = lines.slice(startIndex).join('\n').trim();

  return finalContent;
}

/**
 * Comprehensive content cleanup
 * Removes all preamble, code blocks, and meta-commentary
 *
 * This is the main function to use for cleaning AI-generated LinkedIn posts
 *
 * @param content - Raw AI-generated content
 * @returns Clean, ready-to-use LinkedIn post
 */
export function cleanAIContent(content: string): string {
  if (!content || content.trim().length === 0) {
    return '';
  }

  // Extract the actual post content
  let cleaned = extractPostContent(content);

  // Final trim and normalize line breaks
  cleaned = cleaned.trim();

  // Normalize multiple consecutive blank lines to maximum 2
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned;
}

/**
 * Validates that content looks like a proper LinkedIn post
 * Returns true if content passes basic quality checks
 */
export function isValidLinkedInPost(content: string): boolean {
  if (!content || content.trim().length === 0) {
    return false;
  }

  const trimmed = content.trim();

  // Should be at least 100 characters (meaningful post)
  if (trimmed.length < 100) {
    return false;
  }

  // Should not start with common preamble phrases
  const startsWithPreamble = /^(?:here'?s|i'?ve crafted|i created|based on)/i.test(trimmed);
  if (startsWithPreamble) {
    return false;
  }

  // Should not contain markdown code block markers
  if (trimmed.includes('```')) {
    return false;
  }

  return true;
}

/**
 * Debug helper: logs what was removed during cleaning
 */
export function debugClean(content: string): { original: string; cleaned: string; removed: string } {
  const cleaned = cleanAIContent(content);
  const removed = content.replace(cleaned, '').trim();

  return {
    original: content,
    cleaned,
    removed: removed || '(nothing removed)',
  };
}
