import "server-only";

import { ConfigError } from "./env";
import { ConflictError } from "./repo/dynamo";
import { UploadError } from "./repo/media";

export type LoadResult<T> = { ok: true; data: T } | { ok: false; title: string; text: string; details?: string[] };

/** Classifies backend errors into safe, actionable messages (never leaks secrets). */
export function describeError(e: unknown): { title: string; text: string; details?: string[] } {
  if (e instanceof ConfigError) {
    return { title: "Admin backend not configured", text: "Add these environment variables (see .env.example) and restart the server:", details: e.missing };
  }
  const name = (e as { name?: string })?.name ?? "";
  if (name === "CredentialsProviderError" || /credential/i.test(String((e as Error)?.message))) {
    return { title: "AWS credentials not available", text: "The server could not find AWS credentials. Use an IAM role in production, or AWS_PROFILE / access keys locally." };
  }
  if (name === "AccessDeniedException" || name === "AccessDenied" || name === "UnrecognizedClientException") {
    return { title: "AWS access denied", text: "The server's AWS identity lacks permission for this action. Check the IAM policy described in docs/admin-setup.md." };
  }
  if (name === "ResourceNotFoundException" || name === "NoSuchBucket") {
    return { title: "AWS resource not found", text: "A configured DynamoDB table or S3 bucket was not found. Check table/bucket names and AWS_REGION." };
  }
  console.error("[admin] backend error", e);
  return { title: "Something went wrong", text: "The request could not be completed. Please try again." };
}

export async function load<T>(fn: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, ...describeError(e) };
  }
}

/** Error → action-state message for forms. */
export function actionError(e: unknown): { ok: false; message: string } {
  if (e instanceof ConflictError || e instanceof UploadError) return { ok: false, message: e.message };
  const d = describeError(e);
  return { ok: false, message: `${d.title}. ${d.text}` };
}
