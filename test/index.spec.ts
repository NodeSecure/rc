// Import Node.js Dependencies
import path from "node:path";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { describe, it } from "node:test";

// Import Third-party Dependencies
import Ajv from "ajv";
import merge from "lodash.merge";

// Import Internal Dependencies
import * as RC from "../src/index.js";
import { readJSONSync } from "../src/utils/readJSON.js";
import { generateDefaultRC } from "../src/rc.js";

// CONSTANTS
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("CONSTANTS", () => {
  it("should export a CONSTANTS variable", () => {
    assert("CONSTANTS" in RC);
    assert.equal(RC.CONSTANTS.CONFIGURATION_NAME, ".nodesecurerc");
  });
});

describe("JSON Schema", () => {
  const kDummyPartialMandatoryRC: Partial<RC.RC> = {
    report: {
      title: "hello report",
      logoUrl: "foobar"
    }
  };

  it("should export a valid JSON Schema", () => {
    const ajv = new Ajv();
    const validate = ajv.compile(RC.JSONSchema);

    assert(validate(generateDefaultRC()));

    const completeRC = merge(
      generateDefaultRC("complete"),
      kDummyPartialMandatoryRC
    );
    assert(validate(completeRC));

    assert(!validate({ foo: "bar" }));
  });

  it("should validate all fixtures configuration", async() => {
    const ajv = new Ajv();
    const validate = ajv.compile(RC.JSONSchema);

    const configurationPath = path.join(__dirname, "fixtures", "configuration");
    const configurationFiles = readdirSync(configurationPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && path.extname(dirent.name) === ".json")
      .map((dirent) => path.join(configurationPath, dirent.name));

    for (const fileLocation of configurationFiles) {
      const json = readJSONSync(fileLocation);
      assert(
        validate(json),
        `Should be able to validate RC '${fileLocation}'`
      );
    }
  });
});
