// CONSTANTS
const kPackageVersion = (await import("../package.json")).default.version;

export interface RC {
  /** version of the rc package used to generate the nodesecurerc file */
  version: string;
}

export function generateDefaultRC(): RC {
  return {
    version: kPackageVersion
  };
}
