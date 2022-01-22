// Import Node.js Dependencies
import { readFileSync } from "node:fs";

// Import Types Dependencies
import * as i18n from "@nodesecure/i18n";

function readJSON(path: string) {
  const buf = readFileSync(new URL(path, import.meta.url));

  return JSON.parse(buf.toString());
}

// CONSTANTS
export const JSONSchema = readJSON("./schema/nodesecurerc.json");

export interface RC {
  /** version of the rc package used to generate the nodesecurerc file */
  version: string;
  /**
   * Language to use for i18n in NodeSecure tools
   *
   * @default "english"
   */
  i18n?: i18n.languages;
}

export function generateDefaultRC(): RC {
  return {
    version: "1.0.0",
    i18n: "english"
  };
}
