// Import Node.js Dependencies
import path from "node:path";
import { once } from "node:events";

// Import Third-party Dependencies
import Config from "@slimio/config";
import TR, { Result } from "ts-results";
import { RequireAtLeastOne } from "type-fest";

// Import Internal Dependencies
import { RC, JSONSchema, generateDefaultRC, RCGenerationMode } from "../rc.js";
import * as CONSTANTS from "../constants.js";

// CONSTANTS
const { Ok, Err } = TR;

interface createReadOptions {
  /**
   * If enabled the file will be created if it does not exist on the disk.
   *
   * @default false
   */
  createIfDoesNotExist?: boolean;
  /**
   * RC Generation mode. This option allows to generate a more or less complete configuration for some NodeSecure tools.
   *
   * @default `minimal`
   */
  createMode?: RCGenerationMode | RCGenerationMode[];
}

export type readOptions = RequireAtLeastOne<createReadOptions, "createIfDoesNotExist" | "createMode">;

export async function read(
  location = process.cwd(),
  options: readOptions = Object.create(null)
): Promise<Result<RC, NodeJS.ErrnoException>> {
  try {
    const { createIfDoesNotExist = Boolean(options.createMode), createMode } = options;

    const cfgPath = path.join(location, CONSTANTS.CONFIGURATION_NAME);
    const cfg = new Config<RC>(cfgPath, {
      defaultSchema: JSONSchema,
      createOnNoEntry: createIfDoesNotExist
    });

    await cfg.read(createIfDoesNotExist ? generateDefaultRC(createMode) : void 0);
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
