import type { Location, To } from "react-router-dom";

export type PathLike =
  | Location
  | { pathname?: string; search?: string; hash?: string }
  | string
  | undefined;

export function resolveDestination(from: PathLike): To | undefined {
  if (!from) return undefined;
  if (typeof from === "string") return from;
  if ("pathname" in from) {
    const { pathname = "/", search, hash } = from;
    return { pathname, search, hash };
  }
  return undefined;
}
