// Import Node.js Dependencies
import * as fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "url";

// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import { read } from "../src/index.js";
import { generateDefaultRC } from "../src/rc.js";

// CONSTANTS
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("read .nodesecurerc", () => {
  const location = path.join(os.tmpdir(), "rcread");
  const fixtures = path.join(__dirname, "fixtures");

  before(async() => {
    await fs.mkdir(location);
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

  it("should read fixtures/.nodesecurerc file", async() => {
    const result = await read(fixtures, { createIfDoesNotExist: false });

    expect(result.ok).equal(true);
    expect(result.val).deep.equal({
      version: "2.1.0",
      i18n: "french"
    });
  });
});
