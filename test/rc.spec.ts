// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import {
  generateDefaultRC,
  generateCIConfiguration
} from "../src/rc.js";

describe("generate RC (internals)", () => {
  it("should generate a RC with generation mode set to 'ci'", () => {
    const rc = generateDefaultRC("ci");
    const expectedResult = Object.assign(
      generateDefaultRC(),
      generateCIConfiguration()
    );

    expect(rc).deep.equal(expectedResult);
  });

  it("should generate a RC with generation mode set to Array ['complete']", () => {
    const rc = generateDefaultRC(["complete"]);
    const expectedResult = Object.assign(
      generateDefaultRC(),
      generateCIConfiguration()
    );

    expect(rc).deep.equal(expectedResult);
  });
});
