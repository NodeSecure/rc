/**
 * Configuration dedicated for NodeSecure scanner
 * @see https://github.com/NodeSecure/scanner
 */
export interface ScannerConfiguration {
  /**
   * List of NPM users/authors flagged
   * @see https://github.com/NodeSecure/authors
   */
  flaggedAuthors: Author[];
}
export type Author = {
  name: string,
  email: string,
}

export function generateScannerConfiguration(): { scanner: ScannerConfiguration } {
  const scanner: ScannerConfiguration = {
    flaggedAuthors: []
  };

  return { scanner };
}
