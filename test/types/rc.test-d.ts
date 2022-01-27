// Import Third-party Dependencies
import { expectAssignable } from "tsd";

// Import Internal Dependencies
import {
  generateDefaultRC,
  generateCIConfiguration,
  RC,
  CiConfiguration
} from "../../src/rc";

expectAssignable<RC>(generateDefaultRC());
expectAssignable<{ ci: CiConfiguration }>(generateCIConfiguration());
