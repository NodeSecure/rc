// Import Node.js Dependencies
import { readFileSync } from "node:fs";

function readJSON(path: string) {
  const buf = readFileSync(new URL(path, import.meta.url));

  return JSON.parse(buf.toString());
}

// CONSTANTS
export const JSONSchema = readJSON("./schema/nodesecurerc.json");

export interface RC {
  /** version of the rc package used to generate the nodesecurerc file */
  version: string;
}

export function generateDefaultRC(): RC {
  return {
    version: "1.0.0"
  };
}
