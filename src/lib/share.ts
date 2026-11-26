export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export type SharePayload = {
  title: string;
  text?: string;
  url: string;
};

/**
 * Shares via the native Web Share API when available; otherwise copies the
 * link to the clipboard. User cancellation is reported, not treated as an error.
 */
export async function shareOrCopy(payload: SharePayload): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    const data: ShareData = { title: payload.title, text: payload.text, url: payload.url };
    if (!navigator.canShare || navigator.canShare(data)) {
      try {
        await navigator.share(data);
        return "shared";
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
        // Any other failure (e.g. permission): fall through to copying.
      }
    }
  }
  return (await copyText(payload.url)) ? "copied" : "failed";
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard API blocked (insecure context / permissions): try the legacy path.
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}
