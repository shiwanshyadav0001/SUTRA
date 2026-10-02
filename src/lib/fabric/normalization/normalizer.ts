/**
 * Deterministic Normalization & Token Sanitization Primitives
 * Provides pure, reproducible string canonicalization without non-deterministic heuristics.
 */

export class DeterministicNormalizer {
  /**
   * Cleans and sanitizes raw input: trims, lowercases, replaces non-alphanumeric punctuation with spaces,
   * collapses multiple spaces, and strips diacritics.
   */
  static sanitize(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Strips known administrative noise tokens from a string (e.g. "dist", "district", "tribal", "urban", "rural", "mh", "state")
   */
  static stripNoiseTokens(input: string, noiseWords: string[]): string {
    const clean = this.sanitize(input);
    const tokens = clean.split(' ').filter((t) => !noiseWords.includes(t) && t.length > 0);
    return tokens.join(' ');
  }

  /**
   * Dynamic Programming Levenshtein Distance & Normalized Similarity Ratio (0-100)
   */
  static computeLevenshtein(s1: string, s2: string): { distance: number; similarity: number } {
    const str1 = this.sanitize(s1);
    const str2 = this.sanitize(s2);
    const m = str1.length;
    const n = str2.length;

    if (m === 0) return { distance: n, similarity: n === 0 ? 100 : 0 };
    if (n === 0) return { distance: m, similarity: 0 };
    if (str1 === str2) return { distance: 0, similarity: 100 };

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const distance = dp[m][n];
    const maxLen = Math.max(m, n);
    const similarity = Number(((1 - distance / maxLen) * 100).toFixed(2));
    return { distance, similarity };
  }

  /**
   * Jaccard Token Overlap Similarity (0-100)
   */
  static computeTokenJaccard(s1: string, s2: string): number {
    const tokens1 = new Set(this.sanitize(s1).split(' ').filter(Boolean));
    const tokens2 = new Set(this.sanitize(s2).split(' ').filter(Boolean));

    if (tokens1.size === 0 && tokens2.size === 0) return 100;
    if (tokens1.size === 0 || tokens2.size === 0) return 0;

    let intersectionCount = 0;
    for (const t of tokens1) {
      if (tokens2.has(t)) intersectionCount++;
    }

    const unionCount = new Set([...tokens1, ...tokens2]).size;
    return Number(((intersectionCount / unionCount) * 100).toFixed(2));
  }

  /**
   * Composite Deterministic Similarity combining Levenshtein and Token Overlap
   */
  static computeCompositeSimilarity(query: string, target: string): number {
    const qSan = this.sanitize(query);
    const tSan = this.sanitize(target);

    if (qSan === tSan) return 100;

    const lev = this.computeLevenshtein(qSan, tSan).similarity;
    const jaccard = this.computeTokenJaccard(qSan, tSan);

    // If one contains the other as full words, reward confidence
    const isSubstring = qSan.includes(tSan) || tSan.includes(qSan);
    const substringBonus = isSubstring ? 10 : 0;

    const score = Math.min(100, Number((0.6 * lev + 0.4 * jaccard + substringBonus).toFixed(2)));
    return score;
  }
}
