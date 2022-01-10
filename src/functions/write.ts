// Import Node.js Dependencies
import path from "path";

// Import Third-party Dependencies
import Config from "@slimio/config";
import TR, { Result } from "ts-results";

// Import Internal Dependencies
import { RC, JSONSchema } from "../rc.js";
import * as CONSTANTS from "../constants.js";

// CONSTANTS
const { Ok, Err } = TR;

export interface writeOptions {
  /**
   * Mandatory payload
   */
  payload: Partial<RC>;
  /**
   * Partially update the payload. This implies not to rewrite the content of the file when enabled.
   *
   * @default false
   */
  partialUpdate?: boolean;
}

export async function write(
  location = process.cwd(),
  options: writeOptions
): Promise<Result<void, NodeJS.ErrnoException>> {
  try {
    const { payload, partialUpdate = false } = options;

    const cfgPath = path.join(location, CONSTANTS.CONFIGURATION_NAME);
    const cfg = new Config<RC>(cfgPath, {
      defaultSchema: JSONSchema
    });
    await cfg.read();

    const newPayloadValue = partialUpdate ? Object.assign(cfg.payload, payload) : payload as RC;
    cfg.payload = newPayloadValue;

    await cfg.close();

    return new Ok(void 0);
  }
  catch (error) {
    return new Err(error);
  }
}
