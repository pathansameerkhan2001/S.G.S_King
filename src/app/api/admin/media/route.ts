import { NextResponse } from "next/server";

import { getAdminSession, isSameOrigin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { mediaFolders, signedUrl, uploadImage, type MediaFolder } from "@/lib/server/repo/media";

/** Image upload (multipart). ADMIN session + same-origin required. */
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isSameOrigin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 11 * 1024 * 1024) return NextResponse.json({ error: "File too large." }, { status: 413 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (!mediaFolders.includes(folder as MediaFolder)) return NextResponse.json({ error: "Invalid folder." }, { status: 400 });

  try {
    const key = await uploadImage(file, folder as MediaFolder, session.email ?? session.sub);
    return NextResponse.json({ key, url: await signedUrl(key) }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: actionError(e).message }, { status: 400 });
  }
}
