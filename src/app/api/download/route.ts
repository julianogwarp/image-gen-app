import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Basic safety: only allow http/https
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }
    if (!/^https?:$/.test(parsed.protocol)) {
      return NextResponse.json({ error: "Unsupported protocol" }, { status: 400 });
    }

    const res = await fetch(parsed.toString(), { cache: "no-store" });
    if (!res.ok || !res.body) {
      return NextResponse.json({ error: "Failed to fetch source" }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "application/octet-stream";

    // Derive a filename from the URL path
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const last = pathParts[pathParts.length - 1] || "image";
    const extFromType = contentType.includes("png")
      ? "png"
      : contentType.includes("jpeg") || contentType.includes("jpg")
      ? "jpg"
      : contentType.includes("webp")
      ? "webp"
      : undefined;
    const filename = extFromType && !/\.(png|jpe?g|webp)$/i.test(last) ? `${last}.${extFromType}` : last;

    const headers = new Headers(res.headers);
    headers.set("content-disposition", `attachment; filename="${filename}"`);
    headers.set("content-type", contentType);
    headers.delete("content-length"); // length may be wrong after proxying

    return new NextResponse(res.body, {
      status: 200,
      headers,
    });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
