> [!CAUTION]
> This project (package) has been migrated to [Scanner](https://github.com/NodeSecure/scanner) monorepo, [here](https://github.com/NodeSecure/scanner/tree/master/workspaces/rc)

NodeSecure runtime configuration.

## Requirements

- [Node.js](https://nodejs.org/en/) v18 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @nodesecure/rc
# or
$ yarn add @nodesecure/rc
```

## Usage example

read:

```ts
import * as RC from "@nodesecure/rc";

const configurationPayload = (
  await RC.read(void 0, { createIfDoesNotExist: true })
).unwrap();
console.log(configurationPayload);
```

write:

```ts
import assert from "node:assert/strict";
import * as RC from "@nodesecure/rc";

const writeOpts: RC.writeOptions = {
  payload: { version: "2.0.0" },
  partialUpdate: true,
};

const result = (await RC.write(void 0, writeOpts)).unwrap();
assert.strictEqual(result, void 0);
```

memoize/memoized:

```ts
import * as RC from "@nodesecure/rc";
import assert from "node:assert";

const configurationPayload = (
    await RC.read(void 0, { createMode: "ci" })
).unwrap()

RC.memoize(configurationPayload, { overwrite: true });

const memoizedPayload = RC.memoized();
assert.deepEqual(configurationPayload, memoizedPayload);
```

> 👀 .read and .write return Rust like [Result](https://doc.rust-lang.org/std/result/) object.

## API

> [!NOTE]
> If `undefined`, the location will be assigned to `process.cwd()`.

### read(location?: string, options?: readOptions): Promise< Result< RC, NodeJS.ErrnoException > >

```ts
interface createReadOptions {
  /**
   * If enabled, the file will be created if it does not exist on disk.
   *
   * @default false
   */
  createIfDoesNotExist?: boolean;
  /**
   * Generate a more or less complete configuration.
   *
   * @default `minimal`
   */
  createMode?: RCGenerationMode | RCGenerationMode[];
  /**
   * Automatically cache the configuration when enabled.
   *
   * @default false
   */
  memoize?: boolean;
}

export type readOptions = RequireAtLeastOne<
  createReadOptions,
  "createIfDoesNotExist" | "createMode"
>;
```

The `createIfDoesNotExist` argument can be ignored if `createMode` is provided.

```ts
import * as RC from "@nodesecure/rc";

const configurationPayload = (
  await RC.read(void 0, { createMode: "ci" })
).unwrap();
console.log(configurationPayload);
```

### write(location?: string, options: writeOptions): Promise< Result< void, NodeJS.ErrnoException > >

By default the write API will overwrite the current payload with the provided one. When the `partialUpdate` option is enabled it will merge the new properties with the existing one.

```ts
/**
 * Overwrite the complete payload. partialUpdate property is mandatory.
 */
export interface writeCompletePayload {
  payload: RC;
  partialUpdate?: false;
}

/**
 * Partially update the payload. This implies not to rewrite the content of the file when enabled.
 **/
export interface writePartialPayload {
  payload: Partial<RC>;
  partialUpdate: true;
}

export type writeOptions = writeCompletePayload | writePartialPayload;
```
### memoize(payload: Partial< RC >, options: memoizeOptions = {}): void
By default, the memory API overwrites the previous stored payload. When the `OVERWRITE` option is `false`, it merges new properties with existing properties.

```ts
export interface memoizeOptions {
  overwrite?: boolean;
}
```
The `overwrite` option is used to specify whether data should be overwritten or merged.

### memoized(options: memoizedOptions): Partial< RC > | null
This method returns null, when the default value is null, otherwise, it returns the current value of `memoizedValue`.

```ts
export interface memoizedOptions {
  defaultValue: Partial<RC>;
}
```
If the `defaultValue` property is at null, then this value will be returned when `memoized` is called.

### maybeMemoized(): Option< Partial< RC > >

Same as memoized but return an Option monad.

```ts
import * as RC from "@nodesecure/rc";

const memoized = RC.maybeMemoized()
  .unwrapOr({}); // Some default RC here
```

### clearMemoized(): void
Clear/reset memoized RC

### homedir(): string

Dedicated directory for NodeSecure to store the configuration in the os HOME directory.

```ts
import * as RC from "@nodesecure/rc";

const homedir = RC.homedir();
```

### CONSTANTS

```ts
import assert from "node:assert/strict";
import * as RC from "@nodesecure/rc";

assert.strictEqual(RC.CONSTANTS.CONFIGURATION_NAME, ".nodesecurerc");
```

### Generation Mode

We provide by default a configuration generation that we consider `minimal`. On the contrary, a `complete` value will indicate the generation with all possible default keys.

```ts
export type RCGenerationMode = "minimal" | "ci" | "report" | "scanner" | "complete";
```

However, depending on the NodeSecure tool you are working on, it can be interesting to generate a configuration with some property sets specific to your needs.

Note that you can combine several modes:

```ts
import * as RC from "@nodesecure/rc";

await RC.read(void 0, { createMode: ["ci", "report"] });
```

## JSON Schema

The runtime configuration is validated using a JSON Schema: `./src/schema/nodesecurerc.json`.

It can be retrieved via API if needed:

```ts
import * as RC from "@nodesecure/rc";

console.log(RC.JSONSchema);
```

The JSON schema is a composition of multiple definitions for each tool:

- [ci](./src/schema/defs/ci.json)
  - [ciWarnings](./src/schema/defs/ciWarnings.json)
  - [contact](./src/schema/defs/contact.json)
- [report](./src/schema/defs/report.json)
  - [reportChart](./src/schema/defs/reportChart.json)
- [scanner](./src/schema/defs/scanner.json)

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/thomas-gentilhomme/"><img src="https://avatars.githubusercontent.com/u/4438263?v=4?s=100" width="100px;" alt="Gentilhomme"/><br /><sub><b>Gentilhomme</b></sub></a><br /><a href="https://github.com/NodeSecure/rc/commits?author=fraxken" title="Code">💻</a> <a href="https://github.com/NodeSecure/rc/issues?q=author%3Afraxken" title="Bug reports">🐛</a> <a href="https://github.com/NodeSecure/rc/pulls?q=is%3Apr+reviewed-by%3Afraxken" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/NodeSecure/rc/commits?author=fraxken" title="Documentation">📖</a> <a href="#security-fraxken" title="Security">🛡️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://dev.to/antoinecoulon"><img src="https://avatars.githubusercontent.com/u/43391199?v=4?s=100" width="100px;" alt="Antoine Coulon"/><br /><sub><b>Antoine Coulon</b></sub></a><br /><a href="https://github.com/NodeSecure/rc/commits?author=antoine-coulon" title="Code">💻</a> <a href="https://github.com/NodeSecure/rc/issues?q=author%3Aantoine-coulon" title="Bug reports">🐛</a> <a href="https://github.com/NodeSecure/rc/pulls?q=is%3Apr+reviewed-by%3Aantoine-coulon" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PierreDemailly"><img src="https://avatars.githubusercontent.com/u/39910767?v=4?s=100" width="100px;" alt="PierreD"/><br /><sub><b>PierreD</b></sub></a><br /><a href="https://github.com/NodeSecure/rc/commits?author=PierreDemailly" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fabnguess"><img src="https://avatars.githubusercontent.com/u/72697416?v=4?s=100" width="100px;" alt="Kouadio Fabrice Nguessan"/><br /><sub><b>Kouadio Fabrice Nguessan</b></sub></a><br /><a href="https://github.com/NodeSecure/rc/commits?author=fabnguess" title="Code">💻</a> <a href="#maintenance-fabnguess" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT
