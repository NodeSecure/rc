// Import Node.js Dependencies
import { readFileSync } from "node:fs";

// Import Types Dependencies
import i18n from "@nodesecure/i18n";
import * as vuln from "@nodesecure/vuln";
import * as jsxray from "@nodesecure/js-x-ray";

function readJSON(path: string) {
  const buf = readFileSync(new URL(path, import.meta.url));

  return JSON.parse(buf.toString());
}

// CONSTANTS
export const JSONSchema = readJSON("./schema/nodesecurerc.json");

export type Warnings = "off" | "error" | "warning";

export interface RC {
  /** version of the rc package used to generate the nodesecurerc file */
  version: string;
  /**
   * Language to use for i18n (translation in NodeSecure tools).
   * @see https://developer.mozilla.org/en-US/docs/Glossary/I18N
   *
   * @default `english`
   */
  i18n?: i18n.languages;
  /**
   * Vulnerability strategy to use
   * @see https://github.com/NodeSecure/vuln#available-strategy
   *
   * @default `npm`
   */
  strategy?: vuln.Strategy.Kind;
  /**
   * Configuration Object for https://github.com/NodeSecure/ci
   */
  ci?: {
    /**
     * List of enabled reporters
     * @see https://github.com/NodeSecure/ci#reporters
     */
    reporters?: ("console" | "html")[];
    vulnerabilities?: {
      severity?: "medium" | "high" | "critical" | "all"
    };
    /**
     * JS-X-Ray warnings configuration
     * @see https://github.com/NodeSecure/js-x-ray#warnings-legends-v20
     */
    warnings?: Warnings | Record<jsxray.kindWithValue & "unsafe-import", Warnings>;
  }
}

export function generateDefaultRC(): RC {
  return {
    version: "1.0.0",
    i18n: "english",
    strategy: "npm"
  };
}
