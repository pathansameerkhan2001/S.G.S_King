import { cacheLife } from "next/cache";

/**
 * Current year for the copyright line. With Cache Components, `new Date()`
 * must run inside a cached scope; this is regenerated at most daily.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
