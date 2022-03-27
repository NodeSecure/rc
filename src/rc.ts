// Import Types Dependencies
import i18n from "@nodesecure/i18n";
import * as vuln from "@nodesecure/vuln";

// Import Internal Dependencies
import { readJSONSync } from "./utils/index.js";
import { generateCIConfiguration, CiConfiguration, CiWarnings } from "./projects/ci.js";

// CONSTANTS
export const JSONSchema = readJSONSync("./schema/nodesecurerc.json", import.meta.url);

export interface RC {
  /** version of the rc package used to generate the nodesecurerc file */
  version: string;
  /**
   * Language to use for i18n (translation in NodeSecure tools).
   * @see https://developer.mozilla.org/en-US/docs/Glossary/I18N
   * @see https://github.com/NodeSecure/i18n
   *
   * @default `english`
   */
  i18n?: i18n.languages;
  /**
   * Vulnerability strategy to use. Can be disabled by using `none` as value.
   * @see https://github.com/NodeSecure/vuln#available-strategy
   *
   * @default `npm`
   */
  strategy?: vuln.Strategy.Kind;
  /** NodeSecure ci Object configuration */
  ci?: CiConfiguration;
}

export type RCGenerationMode = "minimal" | "ci" | "complete";

/**
 * @example
 * generateDefaultRC("complete");
 * generateDefaultRC(["ci", "scanner"]); // minimal + ci + scanner
 */
export function generateDefaultRC(mode: RCGenerationMode | RCGenerationMode[] = "minimal"): RC {
  const modes = new Set(typeof mode === "string" ? [mode] : mode);

  const minimalRC = {
    version: "1.0.0",
    i18n: "english" as const,
    strategy: "npm" as const
  };
  const complete = modes.has("complete");

  return Object.assign(
    minimalRC,
    complete || modes.has("ci") ? generateCIConfiguration() : {}
  );
}

export {
  CiConfiguration,
  CiWarnings,
  generateCIConfiguration
};
