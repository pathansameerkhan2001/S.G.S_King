import "server-only";

/**
 * Server-only configuration, read lazily from environment variables.
 * Never prefix these with NEXT_PUBLIC_: none of them may reach the browser.
 * See .env.example for descriptions.
 */

export type AuthConfig = {
  region: string;
  userPoolId: string;
  clientId: string;
  /** Optional: only for confidential app clients (sgs-king-admin-web has none). */
  clientSecret?: string;
  /** Managed login base URL, e.g. https://xxxx.auth.us-east-1.amazoncognito.com */
  domain: string;
  adminGroup: string;
  /** Public origin of this site, e.g. https://www.sgskingfoods.com */
  baseUrl: string;
  /** When set, logout also ends the Cognito session (must be an allowed sign-out URL). */
  logoutRedirectUri?: string;
  sessionSecret: string;
};

export type AwsDataConfig = {
  region: string;
  bucket: string;
  tables: { products: string; categories: string; combos: string; orders: string };
  maxUploadBytes: number;
};

const read = (name: string) => process.env[name]?.trim() || undefined;

export class ConfigError extends Error {
  constructor(public missing: string[]) {
    super(`Missing server configuration: ${missing.join(", ")}`);
    this.name = "ConfigError";
  }
}

export function getAuthConfig(): AuthConfig {
  const required = {
    COGNITO_REGION: read("COGNITO_REGION"),
    COGNITO_USER_POOL_ID: read("COGNITO_USER_POOL_ID"),
    COGNITO_CLIENT_ID: read("COGNITO_CLIENT_ID"),
    COGNITO_DOMAIN: read("COGNITO_DOMAIN"),
    APP_BASE_URL: read("APP_BASE_URL"),
    SESSION_SECRET: read("SESSION_SECRET"),
  };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (required.SESSION_SECRET && required.SESSION_SECRET.length < 32) missing.push("SESSION_SECRET (must be ≥ 32 characters)");
  if (missing.length) throw new ConfigError(missing);
  return {
    region: required.COGNITO_REGION!,
    userPoolId: required.COGNITO_USER_POOL_ID!,
    clientId: required.COGNITO_CLIENT_ID!,
    clientSecret: read("COGNITO_CLIENT_SECRET"),
    domain: required.COGNITO_DOMAIN!.replace(/\/$/, ""),
    adminGroup: read("COGNITO_ADMIN_GROUP") ?? "ADMIN",
    baseUrl: required.APP_BASE_URL!.replace(/\/$/, ""),
    logoutRedirectUri: read("COGNITO_LOGOUT_REDIRECT_URI"),
    sessionSecret: required.SESSION_SECRET!,
  };
}

export function getAwsDataConfig(): AwsDataConfig {
  const region = read("AWS_REGION") ?? read("SGS_AWS_REGION");
  const bucket = read("S3_ASSETS_BUCKET");
  const missing = [!region && "AWS_REGION", !bucket && "S3_ASSETS_BUCKET"].filter(Boolean) as string[];
  if (missing.length) throw new ConfigError(missing);
  return {
    region: region!,
    bucket: bucket!,
    tables: {
      products: read("DDB_PRODUCTS_TABLE") ?? "SGSKingProducts",
      categories: read("DDB_CATEGORIES_TABLE") ?? "SGSKingCategories",
      combos: read("DDB_COMBOS_TABLE") ?? "SGSKingCombos",
      orders: read("DDB_ORDERS_TABLE") ?? "SGSKingOrders",
    },
    maxUploadBytes: Math.min(Number(read("MEDIA_MAX_UPLOAD_MB") ?? 5), 10) * 1024 * 1024,
  };
}

/** Returns the list of missing variables without throwing (for status displays). */
export function missingConfig(): string[] {
  const missing: string[] = [];
  for (const fn of [getAuthConfig, getAwsDataConfig]) {
    try {
      fn();
    } catch (e) {
      if (e instanceof ConfigError) missing.push(...e.missing);
      else throw e;
    }
  }
  return missing;
}
