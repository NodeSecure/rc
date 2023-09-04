// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import { generateDefaultRC, RC } from "../src/rc.js";
import { memoize, memoized, maybeMemoized, clearMemoized } from "../src/index.js";

describe("memoize", () => {
  beforeEach(() => {
    clearMemoized();
  });

  it("should store the payload in memory", () => {
    const payload = generateDefaultRC();
    memoize(payload);

    expect(memoized()).to.deep.equal(payload);
  });

  it("should overwrite the previous payload if the overwrite option is true", () => {
    memoize(generateDefaultRC());
    const payload: Partial<RC> = {
      version: "2.0.0",
      i18n: "french",
      strategy: "snyk"
    };
    memoize(payload, { overwrite: true });

    expect(memoized()).to.deep.equal(payload);
  });

  it("should merge with the previous memoized payload if overwrite option is set to false", () => {
    const rc = generateDefaultRC();
    memoize(rc, { overwrite: true });

    const payload: Partial<RC> = {
      version: "2.0.0",
      i18n: "french",
      strategy: "snyk"
    };
    memoize(payload, { overwrite: false });

    expect(memoized()).to.deep.equal({ ...rc, ...payload });
  });
});

describe("memoized", () => {
  beforeEach(() => {
    clearMemoized();
  });

  it("should return null when there is no memoized value", () => {
    expect(memoized()).to.eq(null);
  });

  it("should return previously memoized RC", () => {
    const rc = generateDefaultRC();
    memoize(rc);

    expect(memoized()).to.deep.equal(rc);
  });
});

describe("maybeMemoized", () => {
  beforeEach(() => {
    clearMemoized();
  });

  it("should return None when there is no memoized value", () => {
    const option = maybeMemoized();
    expect(option.none).to.eq(true);
    expect(option.unwrapOr(null)).to.eq(null);
  });

  it("should unwrap previously memoized RC", () => {
    const rc = generateDefaultRC();
    memoize(rc);

    const option = maybeMemoized();
    expect(option.some).to.eq(true);
    expect(option.unwrap()).to.deep.equal(rc);
  });
});

describe("clearMemoized", () => {
  it("should clear memoized value", () => {
    const rc = generateDefaultRC();
    memoize(rc);

    expect(memoized()).to.not.equal(null);
    clearMemoized();
    expect(memoized()).to.equal(null);
  });
});
