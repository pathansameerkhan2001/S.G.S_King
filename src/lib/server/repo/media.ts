import "server-only";

import { randomUUID } from "node:crypto";

import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, type _Object } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { bucket, s3Client } from "../aws";
import { getAwsDataConfig } from "../env";

import { listCategories, listCombos, listProducts } from "./catalog";
import { ConflictError } from "./dynamo";
import { readDoc } from "./documents";

export const mediaFolders = ["products", "combos", "categories", "homepage", "reviews"] as const;
export type MediaFolder = (typeof mediaFolders)[number];

/** Accepted image types, identified by file signature (magic bytes), not the file name. */
const SIGNATURES: { type: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { type: "image/webp", ext: "webp", test: (b) => b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" },
  { type: "image/gif", ext: "gif", test: (b) => b.toString("ascii", 0, 6) === "GIF87a" || b.toString("ascii", 0, 6) === "GIF89a" },
  { type: "image/avif", ext: "avif", test: (b) => b.toString("ascii", 4, 8) === "ftyp" && /avi[fs]/.test(b.toString("ascii", 8, 12)) },
];

export type MediaItem = { key: string; folder: string; name: string; size: number; uploadedAt: string; url: string };

export class UploadError extends Error {}

export async function uploadImage(file: File, folder: MediaFolder, uploadedBy: string): Promise<string> {
  const { maxUploadBytes } = getAwsDataConfig();
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > maxUploadBytes) throw new UploadError(`Images must be ${Math.round(maxUploadBytes / 1024 / 1024)} MB or smaller.`);
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = SIGNATURES.find((s) => s.test(buffer));
  if (!kind) throw new UploadError("Only JPEG, PNG, WebP, AVIF or GIF images are allowed.");

  const d = new Date();
  const key = `media/${folder}/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${kind.ext}`;
  const original = file.name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "image";
  await s3Client().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: buffer,
      ContentType: kind.type,
      ServerSideEncryption: "AES256",
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: { "original-name": encodeURIComponent(original), "uploaded-by": encodeURIComponent(uploadedBy) },
    }),
  );
  return key;
}

/** Short-lived signed URL for previewing a private object in the admin panel. */
export const signedUrl = (key: string, seconds = 600) =>
  getSignedUrl(s3Client(), new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn: seconds });

export async function listMedia(folder?: MediaFolder): Promise<MediaItem[]> {
  const objects: _Object[] = [];
  let ContinuationToken: string | undefined;
  do {
    const res = await s3Client().send(new ListObjectsV2Command({ Bucket: bucket(), Prefix: folder ? `media/${folder}/` : "media/", ContinuationToken }));
    objects.push(...(res.Contents ?? []));
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken && objects.length < 5000);

  const sorted = objects.filter((o) => o.Key).sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0));
  return Promise.all(
    sorted.map(async (o) => ({
      key: o.Key!,
      folder: o.Key!.split("/")[1] ?? "",
      name: o.Key!.split("/").pop() ?? o.Key!,
      size: o.Size ?? 0,
      uploadedAt: o.LastModified?.toISOString() ?? "",
      url: await signedUrl(o.Key!),
    })),
  );
}

export async function originalName(key: string) {
  const head = await s3Client().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
  const raw = head.Metadata?.["original-name"];
  return raw ? decodeURIComponent(raw) : key.split("/").pop();
}

/** Map of media key → places it is referenced (one pass over all data). */
export async function mediaUsageMap(): Promise<Map<string, string[]>> {
  const [products, combos, categories, homepage, reviews] = await Promise.all([
    listProducts(),
    listCombos(),
    listCategories(),
    readDoc("homepage"),
    readDoc("reviews"),
  ]);
  const map = new Map<string, string[]>();
  const add = (key: string | undefined, where: string) => {
    if (!key) return;
    map.set(key, [...(map.get(key) ?? []), where]);
  };
  products.forEach((p) => p.images.forEach((k) => add(k, `Product: ${p.name}`)));
  combos.forEach((c) => c.images.forEach((k) => add(k, `Combo: ${c.name}`)));
  categories.forEach((c) => add(c.imageKey, `Category: ${c.name}`));
  const hp = homepage.data;
  add(hp?.hero.imageKey, "Homepage: hero");
  hp?.promoSections.forEach((sec) => add(sec.imageKey, `Homepage: ${sec.title}`));
  reviews.data.forEach((r) => add(r.imageKey, `Review: ${r.customerName}`));
  return map;
}

export const mediaUsage = async (key: string) => (await mediaUsageMap()).get(key) ?? [];

export async function deleteMedia(key: string) {
  if (!key.startsWith("media/")) throw new UploadError("Invalid media key.");
  const uses = await mediaUsage(key);
  if (uses.length) throw new ConflictError(`This image is still in use (${uses.join("; ")}). Remove it there first.`);
  await s3Client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
