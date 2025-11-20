/**
 * Font utility for @thermal-print/react
 *
 * Note: Thermal printers use built-in fonts only.
 * Font.register() is a no-op but available for future PDF generation support.
 */

interface FontSource {
  src: string;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string | number;
}

interface FontOptions {
  family: string;
  fonts?: FontSource[];
}

const registeredFonts: Map<string, FontOptions> = new Map();

export const Font = {
  /**
   * Register a custom font (no-op for thermal printing, reserved for future PDF export)
   *
   * @param options Font options with family name and sources
   *
   * @example
   * ```typescript
   * Font.register({
   *   family: 'Roboto',
   *   fonts: [
   *     { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2' }
   *   ]
   * });
   * ```
   */
  register(options: FontOptions): void {
    registeredFonts.set(options.family, options);

    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[@thermal-print/react] Font.register("${options.family}") called. ` +
        `Thermal printers use built-in fonts only. ` +
        `This registration is stored for potential future PDF export feature.`
      );
    }
  },

  /**
   * Register a hyphenation callback (no-op)
   */
  registerHyphenationCallback(callback: (word: string) => string[]): void {
    // No-op: thermal printers don't support hyphenation
  },

  /**
   * Register emoji source (no-op)
   */
  registerEmojiSource(options: { format: string; url: string }): void {
    // No-op: thermal printers typically don't support emoji
  },

  /**
   * Get all registered fonts (for future PDF export)
   */
  getRegisteredFonts(): Map<string, FontOptions> {
    return registeredFonts;
  },

  /**
   * Clear all registered fonts
   */
  clear(): void {
    registeredFonts.clear();
  }
};
