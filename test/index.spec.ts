// Import Node.js Dependencies
import path from "node:path";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Import Third-party Dependencies
import { expect } from "chai";
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
    expect("CONSTANTS" in RC).equal(true);
    expect(RC.CONSTANTS.CONFIGURATION_NAME).equal(".nodesecurerc");
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

    expect(validate(generateDefaultRC())).equal(true);

    const completeRC = merge(
      generateDefaultRC("complete"),
      kDummyPartialMandatoryRC
    );
    expect(validate(completeRC)).equal(true);

    expect(validate({ foo: "bar" })).equal(false);
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
      expect(
        validate(json),
        `Should be able to validate RC '${fileLocation}'`
      ).equal(true);
    }
  });
});
