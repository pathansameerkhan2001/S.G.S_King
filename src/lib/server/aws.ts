import "server-only";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

import { getAwsDataConfig } from "./env";

/**
 * AWS SDK clients (server only). Credentials come from the standard AWS
 * credential chain: an IAM role on the host in production, or
 * AWS_PROFILE / AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY locally.
 * No credentials are ever sent to the browser.
 */
let ddb: DynamoDBDocumentClient | null = null;
let s3: S3Client | null = null;

export function dynamo() {
  if (!ddb) {
    const { region } = getAwsDataConfig();
    ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
      marshallOptions: { removeUndefinedValues: true, convertClassInstanceToMap: false },
    });
  }
  return ddb;
}

export function s3Client() {
  if (!s3) s3 = new S3Client({ region: getAwsDataConfig().region });
  return s3;
}

export const tables = () => getAwsDataConfig().tables;
export const bucket = () => getAwsDataConfig().bucket;
