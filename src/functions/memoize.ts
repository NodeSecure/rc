// Import Third-party Dependencies
import merge from "lodash.merge";
import { Some, None, Option } from "@openally/result";

// Import Internal Dependencies
import { RC } from "../rc.js";

let memoizedValue: Partial<RC> | null = null;

export interface memoizeOptions {
  /**
   * If enabled it will overwrite (crush) the previous memoized RC
   * @default true
   */
  overwrite?: boolean;
}

export function memoize(
  payload: Partial<RC>,
  options: memoizeOptions = {}
): void {
  const { overwrite = true } = options;

  if (memoizedValue === null || overwrite) {
    memoizedValue = payload;
  }
  else {
    memoizedValue = merge({}, memoizedValue, payload);
  }
}

export interface memoizedOptions {
  defaultValue: Partial<RC>;
}

export function memoized(
  options?: memoizedOptions
): Partial<RC> | null {
  const { defaultValue = null } = options ?? {};

  return memoizedValue ?? defaultValue;
}

export function maybeMemoized(): Option<Partial<RC>> {
  return memoizedValue === null ?
    None :
    Some(memoizedValue);
}

export function clearMemoized(): void {
  memoizedValue = null;
}

