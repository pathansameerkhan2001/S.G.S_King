# S.G.S King Foods — Admin Panel setup

## 1. Verified AWS configuration (read-only check, 26 Nov 2026)

| Item | Value |
| --- | --- |
| Region | `us-east-1` (Cognito, DynamoDB, S3) |
| User pool | `us-east-1_I83AzzfjR` |
| App client | `sgs-king-admin-web` = `5siadavgn0llmbih71jli91pf9` (no client secret → PKCE) |
| Managed login domain | `https://us-east-1i83azzfjr.auth.us-east-1.amazoncognito.com` |
| OAuth | code grant; scopes `openid email phone` |
| Callback URLs | `https://www.sgskingfoods.com/admin/auth/callback` only |
| Sign-out URLs | **none** |
| Self sign-up | **enabled** (`AllowAdminCreateUserOnly = false`) |
| Groups | `ADMIN` |
| S3 bucket | `sgs-king-foods-assets`, Block Public Access ON, SSE-S3, no CORS, empty |
| DynamoDB | `SGSKingProducts`, `SGSKingCategories`, `SGSKingCombos`, `SGSKingOrders` (+ unused `SGSKingCustomers`); on-demand, deletion protection, no GSIs, all empty |

## 2. Cognito changes you need to make (console)

App client **sgs-king-admin-web** → *Login pages* → *Edit managed login pages configuration*:

1. **Allowed callback URLs** — add for local development:
   `http://localhost:3000/admin/auth/callback`
   (keep `https://www.sgskingfoods.com/admin/auth/callback` for production).
2. **Allowed sign-out URLs** — add (none are configured today):
   `https://www.sgskingfoods.com/admin/login` and `http://localhost:3000/admin/login`
   then set `COGNITO_LOGOUT_REDIRECT_URI` to the matching one.
3. **Scopes** — `openid` and `email` are required; `phone` is not used and may be removed.

User pool → *Sign-up* → **disable self-registration** (“Allow users to sign themselves up” → off).
The admin panel already denies anyone outside the `ADMIN` group, but self sign-up lets
strangers create accounts in the pool.

Recommended: enable MFA for admin users.

## 3. Least-privilege IAM policy for the server

Attach to the role (or user) the website runs as:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CatalogTables",
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Scan"],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/SGSKingProducts",
        "arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/SGSKingCategories",
        "arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/SGSKingCombos",
        "arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/SGSKingOrders"
      ]
    },
    {
      "Sid": "AssetObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": ["arn:aws:s3:::sgs-king-foods-assets/media/*", "arn:aws:s3:::sgs-king-foods-assets/config/*"]
    },
    {
      "Sid": "AssetListing",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::sgs-king-foods-assets",
      "Condition": { "StringLike": { "s3:prefix": ["media/*", "config/*"] } }
    }
  ]
}
```

No Cognito admin API permissions are needed (login uses the public OAuth endpoints).

## 4. Data design (no new AWS resources)

- Products, categories, combos and orders live in their DynamoDB tables (key = `productId` /
  `categoryId` / `comboId` / `orderId`). Every item has `version`; updates use conditional
  writes (optimistic locking).
- Store settings, homepage config, reviews and coupons are JSON documents in the existing
  bucket under `config/` with ETag-conditional writes. Move them to tables later if volume grows
  (needs approval).
- Images: `media/{products|combos|categories|homepage|reviews}/YYYY/MM/<uuid>.<ext>`, uploaded
  through the server (type checked by file signature, size-limited), private, previewed via
  10-minute presigned URLs.
- Lists use paginated `Scan` (fine for catalogue size). **Recommended later (approval needed):**
  a GSI on `SGSKingOrders` (e.g. `status` + `createdAt`) once orders exceed a few thousand.

## 5. Security model

- Cognito managed login, Authorization Code + PKCE + `state` + `nonce`.
- Tokens are exchanged server-side and never sent to the browser. The ID token signature is
  verified (aws-jwt-verify, JWKS); `ADMIN` group membership is required.
- Session: AES-256-GCM encrypted, HttpOnly, SameSite=Lax cookie (`__Host-` prefix + Secure on
  HTTPS) containing only the verified identity; lifetime = ID-token lifetime (60 min); no
  refresh tokens are stored. Group removal takes effect at the next sign-in (≤ 60 min).
- Deny by default: `src/proxy.ts` validates the session for `/admin/*` and `/api/admin/*`;
  every admin page, server action and API route calls `requireAdmin()` / `getAdminSession()`
  again. Logout and uploads require same-origin requests; Server Actions have built-in origin
  checks.

## 6. Not yet connected (next steps)

- The storefront still reads `src/content/*` and `src/lib/catalog.ts`. Switching it to read
  the DynamoDB/S3 data (and serving images publicly via CloudFront with Origin Access Control)
  is the next phase and needs a CloudFront distribution (new AWS resource → approval).
- Storefront checkout does not create orders yet; an order-creation API (with server-side
  price recalculation and coupon validation) is required before the Orders module receives data.
