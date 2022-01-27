// Import Third-party Dependencies
import { Result } from "ts-results";
import { expectAssignable } from "tsd";

// Import Internal Dependencies
import { read, write, RC } from "../../src/index.js";

expectAssignable<Promise<Result<RC, NodeJS.ErrnoException>>>(read());
expectAssignable<Promise<Result<void, NodeJS.ErrnoException>>>(write("test", {
  payload: {},
  partialUpdate: true
}));
