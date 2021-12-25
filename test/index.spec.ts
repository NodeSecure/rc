// Import Third-party Dependencies
import { expect } from "chai";
import Ajv from "ajv";

// Import Internal Dependencies
import * as RC from "../src/index";

describe("CONSTANTS", () => {
  it("should export a CONSTANTS variable", () => {
    expect("CONSTANTS" in RC).equal(true);
    expect(RC.CONSTANTS.CONFIGURATION_NAME).equal(".nodesecurerc");
  });
});

describe("JSON Schema", () => {
  it("should export a valid JSON Schema", () => {
    const ajv = new Ajv();
    const validate = ajv.compile(RC.JSONSchema);

    expect(validate({ version: "1.0.0" })).equal(true);
    expect(validate({ foo: "bar" })).equal(false);
  });
});
