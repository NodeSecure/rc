// Import Node.js Dependencies
import * as fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import { read, CONSTANTS, memoized, memoize, clearMemoized } from "../src/index.js";
import { generateDefaultRC } from "../src/rc.js";

// CONSTANTS
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("read .nodesecurerc", () => {
  const location = path.join(os.tmpdir(), "rcread");
  const fixtures = path.join(__dirname, "fixtures");

  before(async() => {
    await fs.mkdir(location);
  });

  beforeEach(async() => {
    await fs.rm(path.join(location, CONSTANTS.CONFIGURATION_NAME), { force: true });
  });

  after(async() => {
    await fs.rm(location, { force: true, recursive: true });
  });

  it("should return a Node.js ENOENT Error because there is no .nodesecurerc file at the given location", async() => {
    const result = await read(location);

    expect(result.ok).equal(false);

    const nodejsError = result.val as NodeJS.ErrnoException;
    expect(nodejsError instanceof Error).equal(true);
    expect(nodejsError.code).equal("ENOENT");
  });

  it("should read and create a new .nodesecurerc file because there is none at the given location", async() => {
    const result = await read(location, { createIfDoesNotExist: true });

    expect(result.ok).equal(true);
    expect(result.val).deep.equal(generateDefaultRC());
  });

  it("should read and create a new .nodesecurerc with createMode equal to 'ci'", async() => {
    const result = await read(location, { createMode: "ci" });

    expect(result.ok).equal(true);
    expect(result.val).deep.equal(generateDefaultRC("ci"));
  });

  it("should read fixtures/.nodesecurerc file", async() => {
    await read(location, { createIfDoesNotExist: true });
    const result = await read(fixtures, { createIfDoesNotExist: false });

    expect(result.ok).equal(true);
    expect(result.val).deep.equal({
      version: "2.1.0",
      i18n: "french",
      strategy: "none"
    });
  });
});

describe("read | memoize option", () => {
  const location = path.join(os.tmpdir(), "rcread");

  before(async() => {
    await fs.mkdir(location);
  });

  beforeEach(async() => {
    clearMemoized();
    await fs.rm(path.join(location, CONSTANTS.CONFIGURATION_NAME), { force: true });
  });

  after(async() => {
    await fs.rm(location, { force: true, recursive: true });
  });

  it("should return the default value 'null' when the memoize option is not declared ", async() => {
    await read(location, { createIfDoesNotExist: true });
    expect(memoized()).to.eq(null);
  });

  it("should return the configuration passed in parameter", async() => {
    await read(location, { createIfDoesNotExist: true, memoize: true });
    expect(memoized()).to.deep.equal(generateDefaultRC());
  });

  it("must overwrite the previously stored payload", async() => {
    await read(location, { createIfDoesNotExist: true, memoize: true });

    memoize(generateDefaultRC("report"));

    expect(memoized()).to.deep.equal(generateDefaultRC("report"));
  });
});
