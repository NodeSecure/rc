// Import Node.js Dependencies
import * as fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import { read, write, CONSTANTS } from "../src/index";
import { generateDefaultRC } from "../src/rc";

describe("write and/or update .nodesecurerc", () => {
  const location = path.join(os.tmpdir(), "rcwrite");

  before(async() => {
    await fs.mkdir(location);
  });

  beforeEach(async() => {
    await fs.rm(path.join(location, CONSTANTS.CONFIGURATION_NAME), { force: true });
    await read(location, { createIfDoesNotExist: true });
  });

  after(async() => {
    await fs.rm(location, { force: true, recursive: true });
  });

  it("should return a Node.js ENOENT Error because there is no .nodesecurerc file at the given location", async() => {
    await fs.rm(path.join(location, CONSTANTS.CONFIGURATION_NAME), { force: true });

    const payload = { ...generateDefaultRC(), version: "4.5.2" };
    const result = await write(location, { payload });

    expect(result.ok).equal(false);

    const nodejsError = result.val as NodeJS.ErrnoException;
    expect(nodejsError instanceof Error).equal(true);
    expect(nodejsError.code).equal("ENOENT");
  });

  it("should fail to write because the payload is not matching the JSON Schema", async() => {
    const payload = { foo: "bar" };

    // @ts-ignore
    const result = await write(location, { payload });
    // TODO: fix Ajv 8 error in SlimIO/Config
    expect(result.ok).equal(false);
    expect(result.val instanceof Error).equal(true);
  });

  it("should rewrite a complete payload (content of .nodesecurerc)", async() => {
    const payload = { ...generateDefaultRC(), version: "4.5.2" };

    const writeResult = await write(location, { payload });
    expect(writeResult.ok).equal(true);
    expect(writeResult.val).equal(void 0);

    const readResult = await read(location, { createIfDoesNotExist: false });
    expect(readResult.ok).equal(true);
    expect(readResult.val).deep.equal(payload);
  });

  // TODO: partial update test
});
