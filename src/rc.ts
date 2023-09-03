// Import Node.js Dependencies
import os from "node:os";
import path from "node:path";

// Import Third-party Dependencies
import i18n from "@nodesecure/i18n";
import * as vuln from "@nodesecure/vuln";

// Import Internal Dependencies
import { GLOBAL_CONFIGURATION_DIRECTORY } from "./constants.js";
import { loadJSONSchemaSync } from "./schema/loader.js";

import { generateCIConfiguration, CiConfiguration, CiWarnings } from "./projects/ci.js";
import { generateReportConfiguration, ReportConfiguration, ReportChart } from "./projects/report.js";
import { generateScannerConfiguration, ScannerConfiguration, Author } from "./projects/scanner.js";

// CONSTANTS
export const JSONSchema = loadJSONSchemaSync();

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
  /** NodeSecure scanner Object configuration */
  scanner?: ScannerConfiguration;
  /** NodeSecure ci Object configuration */
  ci?: CiConfiguration;
  /** NodeSecure report Object configuration */
  report?: ReportConfiguration;
}

export type RCGenerationMode = "minimal" | "ci" | "report" | "scanner" | "complete";

/**
 * @example
 * generateDefaultRC("complete");
 * generateDefaultRC(["ci", "report"]); // minimal + ci + report
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
    complete || modes.has("ci") ? generateCIConfiguration() : {},
    complete || modes.has("report") ? generateReportConfiguration() : {},
    complete || modes.has("scanner") ? generateScannerConfiguration() : {}
  );
}

/**
 * Dedicated directory for NodeSecure to store the configuration in the os HOME directory.
 */
export function homedir(): string {
  return path.join(os.homedir(), GLOBAL_CONFIGURATION_DIRECTORY);
}

export {
  generateCIConfiguration,
  CiConfiguration,
  CiWarnings,

  generateReportConfiguration,
  ReportConfiguration,
  ReportChart,

  generateScannerConfiguration,
  ScannerConfiguration,
  Author
};
