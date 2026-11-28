import "server-only";

import { GetObjectCommand, NoSuchKey, PutObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";

import type { Coupon, HomepageConfig, Review, StoreSettings } from "@/lib/admin/schemas";

import { bucket, s3Client } from "../aws";
import { ConflictError } from "./dynamo";

/**
 * Small JSON configuration documents stored in the existing private S3
 * bucket under config/ (no extra AWS resources). Writes are conditional on
 * the ETag that was read, so concurrent edits can't silently overwrite.
 */
type DocMap = {
  settings: StoreSettings | null;
  homepage: HomepageConfig | null;
  reviews: Review[];
  coupons: Coupon[];
};
type DocName = keyof DocMap;

const empty: { [K in DocName]: DocMap[K] } = { settings: null, homepage: null, reviews: [], coupons: [] };
const keyOf = (name: DocName) => `config/${name}.json`;

export type Versioned<T> = { data: T; etag: string | null };

export async function readDoc<K extends DocName>(name: K): Promise<Versioned<DocMap[K]>> {
  try {
    const res = await s3Client().send(new GetObjectCommand({ Bucket: bucket(), Key: keyOf(name) }));
    const body = await res.Body!.transformToString("utf-8");
    return { data: JSON.parse(body) as DocMap[K], etag: res.ETag ?? null };
  } catch (e) {
    if (e instanceof NoSuchKey || (e instanceof S3ServiceException && e.$metadata.httpStatusCode === 404)) {
      return { data: empty[name], etag: null };
    }
    throw e;
  }
}

/** Writes only if the document is unchanged since it was read (If-Match / If-None-Match). */
export async function writeDoc<K extends DocName>(name: K, data: DocMap[K], expectedEtag: string | null) {
  try {
    await s3Client().send(
      new PutObjectCommand({
        Bucket: bucket(),
        Key: keyOf(name),
        Body: JSON.stringify(data, null, 2),
        ContentType: "application/json",
        ServerSideEncryption: "AES256",
        ...(expectedEtag ? { IfMatch: expectedEtag } : { IfNoneMatch: "*" }),
      }),
    );
  } catch (e) {
    if (e instanceof S3ServiceException && (e.$metadata.httpStatusCode === 412 || e.$metadata.httpStatusCode === 409)) {
      throw new ConflictError("These settings were changed by someone else. Reload and try again.");
    }
    throw e;
  }
}
