// Import Node.js Dependencies
import path from "path";

// Import Third-party Dependencies
import Config from "@slimio/config";
import TR from "ts-results";

// Import Internal Dependencies
import schema from "../schema/nodesecurerc.json";
import { RC } from "../rc";
import * as CONSTANTS from "../constants";

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
): Promise<TR.Result<void, NodeJS.ErrnoException>> {
  try {
    const { payload, partialUpdate = false } = options;

    const cfgPath = path.join(location, CONSTANTS.CONFIGURATION_NAME);
    const cfg = new Config<RC>(cfgPath, {
      defaultSchema: schema
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
