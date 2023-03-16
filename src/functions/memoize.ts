// Import Third-party Dependencies
import merge from "lodash.merge";

// Import Internal Dependencies
import { RC } from "../rc.js";

let memoizedValue: Partial<RC> | null = null;

export interface memoizeOptions {
  /** * @default true */
  overwrite?: boolean;
}

export interface memoizedOptions {
  /** * @default null */
  defaultValue?: Partial<RC>;
}

export function memoize(payload: Partial<RC>, options: memoizeOptions = {}): void {
  const { overwrite = true } = options;
  if (memoizedValue === null || overwrite) {
    memoizedValue = payload;
  }
  else {
    memoizedValue = merge({}, memoizedValue, payload);
  }
}

export function memoized(options: memoizedOptions = {}): Partial<RC> | null {
  const { defaultValue = null } = options;

  return memoizedValue ?? defaultValue;
}

export function clearMemoized(): void {
  memoizedValue = null;
}

