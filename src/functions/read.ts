// Import Node.js Dependencies
import path from "node:path";
import { once } from "node:events";

// Import Third-party Dependencies
import Config from "@slimio/config";
import TR, { Result } from "ts-results";

// Import Internal Dependencies
import { RC, JSONSchema, generateDefaultRC } from "../rc.js";
import * as CONSTANTS from "../constants.js";

// CONSTANTS
const { Ok, Err } = TR;

export interface readOptions {
  /**
   * If enabled the file will be created if it does not exist on the disk.
   *
   * @default false
   */
  createIfDoesNotExist?: boolean;
}

export async function read(
  location = process.cwd(),
  options: readOptions = Object.create(null)
): Promise<Result<RC, NodeJS.ErrnoException>> {
  try {
    const { createIfDoesNotExist = false } = options;

    const cfgPath = path.join(location, CONSTANTS.CONFIGURATION_NAME);
    const cfg = new Config<RC>(cfgPath, {
      defaultSchema: JSONSchema,
      createOnNoEntry: createIfDoesNotExist
    });

    await cfg.read(createIfDoesNotExist ? generateDefaultRC() : void 0);
    if (createIfDoesNotExist) {
      await once(cfg, "configWritten");
    }
    const result = cfg.payload;

    await cfg.close();

    return new Ok(result);
  }
  catch (error) {
    return new Err(error);
  }
}
