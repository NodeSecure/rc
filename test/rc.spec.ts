// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import {
  generateDefaultRC,
  generateCIConfiguration,
  generateReportConfiguration,
  generateScannerConfiguration
} from "../src/rc.js";

describe("generateDefaultRC (internals)", () => {
  it(`should generate a RC with argument 'mode' equal 'ci' and
  then return an RC combining Default + CIConfiguration`, () => {
    const rc = generateDefaultRC("ci");
    const expectedResult = Object.assign(
      generateDefaultRC(),
      generateCIConfiguration()
    );

    expect(rc).deep.equal(expectedResult);
  });

  it(`should generate a RC with argument 'mode' equal 'report' and
  then return an RC combining Default + ReportConfiguration`, () => {
    const rc = generateDefaultRC("report");
    const expectedResult = Object.assign(
      generateDefaultRC(),
      generateReportConfiguration()
    );

    expect(rc).deep.equal(expectedResult);
  });

  it(`should generate a RC with argument 'mode' equal 'scanner' and
  then return an RC combining Default + ScannerConfiguration`, () => {
    const rc = generateDefaultRC("scanner");
    const expectedResult = Object.assign(
      generateDefaultRC(),
      generateScannerConfiguration()
    );

    expect(rc).deep.equal(expectedResult);
  });

  it(`should generate a RC with argument 'mode' equal an Array ['complete'] and
  then return an RC combining all kind of available configurations internally`, () => {
    const rc = generateDefaultRC(["complete"]);
    const expectedResult = Object.assign(
      generateDefaultRC(),
      generateCIConfiguration(),
      generateReportConfiguration(),
      generateScannerConfiguration()
    );

    expect(rc).deep.equal(expectedResult);
  });
});
