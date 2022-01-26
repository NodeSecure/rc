# rc
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/NodeSecure/rc/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/NodeSecure/rc/commit-activity)
[![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md
)
[![mit](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/NodeSecure/rc/blob/master/LICENSE)

NodeSecure runtime configuration.

## Requirements
- [Node.js](https://nodejs.org/en/) v16 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @nodesecure/rc
# or
$ yarn add @nodesecure/rc
```

## Usage example

Read:

```ts
import * as RC from "@nodesecure/rc";

const configurationPayload = (
  await RC.read(void 0, { createIfDoesNotExist: true })
).unwrap();
console.log(configurationPayload);
```

Write:
```ts
import assert from "node:assert/strict";
import * as RC from "@nodesecure/rc";

const writeOpts: RC.writeOptions = {
  payload: { version: "2.0.0" },
  partialUpdate: true
};

const result = (
  await RC.write(void 0, writeOpts)
).unwrap();
assert.strictEqual(result, void 0);
```

> 👀 .read and .write return Rust like [Result](https://doc.rust-lang.org/std/result/) object. Under the hood we use [ts-results](https://github.com/vultix/ts-results) to achieve this.

## API

> If `undefined` the location will be assigned to `process.cwd()`.

### read(location?: string, options?: readOptions): Promise< Result< RC, NodeJS.ErrnoException > >

```ts
interface createReadOptions {
  /**
   * If enabled the file will be created if it does not exist on the disk.
   *
   * @default false
   */
  createIfDoesNotExist?: boolean;
  /**
   * RC Generation mode. This option allows to generate a more or less complete configuration for some NodeSecure tools.
   *
   * @default `minimal`
   */
  createMode?: RCGenerationMode | RCGenerationMode[];
}

export type readOptions = RequireAtLeastOne<createReadOptions, "createIfDoesNotExist" | "createMode">;
```

### write(location?: string, options: writeOptions): Promise< Result< void, NodeJS.ErrnoException > >

```ts
export interface writeOptions {
  /**
   * Mandatory payload
   */
  payload: Partial<RC>;
  /**
   * Partially update the payload. This implies not to rewrite the content of the file when enabled.
   *
   * @default false
   */
  partialUpdate?: boolean;
}
```

### CONSTANTS

```ts
import assert from "node:assert/strict";
import * as RC from "@nodesecure/rc";

assert.strictEqual(RC.CONSTANTS.CONFIGURATION_NAME, ".nodesecurerc");
```

## JSON Schema

The runtime configuration is validated with a JSON Schema: `./src/schema/nodesecurerc.json`.

It can be retrieved by API if required:
```ts
import * as RC from "@nodesecure/rc";

console.log(RC.JSONSchema);
```

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
MIT
