// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import { generateDefaultRC, RC } from "../src/rc.js";
import { memoize, memoized, clearMemoized } from "../src/index.js";

let memoizedPayload: Partial<RC> | null = null;

describe("memoize()", () => {
  beforeEach(() => {
    memoizedPayload = null;
  });

  it("should store the payload in memory", () => {
    const payload = generateDefaultRC();
    memoize(payload, { overwrite: false });

    memoizedPayload = memoized();

    expect(memoizedPayload).to.deep.equal(payload);
  });

  it("should overwrite the previous payload if the overwrite option is true", () => {
    const payload = { version: "2.0.0", i18n: "french", strategy: "yarn" } as any;
    memoize(payload, { overwrite: true });
    memoizedPayload = memoized();

    expect(memoizedPayload).to.deep.equal(payload);
  });

  it("should merge with the previous memoized payload if overwrite option is set to false", () => {
    const rc = generateDefaultRC();
    memoize(rc, { overwrite: true });

    const payload = { version: "2.0.0", i18n: "french", strategy: "yarn" } as any;
    memoize(payload, { overwrite: false });
    memoizedPayload = memoized();

    expect(memoizedPayload).to.deep.equal({ ...rc, ...payload });
  });
});


describe("memoized", () => {
  beforeEach(() => {
    clearMemoized();
    memoizedPayload = null;
  });


  it("must return the default value (null)", () => {
    const result = memoized();

    expect(result).to.deep.equal(memoizedPayload);
  });

  it("should return previously remembered configuration", () => {
    const rc = generateDefaultRC();

    memoize(rc, { overwrite: true });
    memoizedPayload = memoized();

    expect(memoizedPayload).to.deep.equal(rc);
  });
});
