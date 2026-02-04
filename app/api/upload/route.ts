import { NextResponse } from "next/server";
import { uploadImage } from "../../../lib/upload";
import { requireAdmin } from "../../../lib/apiAuth";

const MAX_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";

export async function POST(req: Request) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Please sign in again on the same URL (localhost vs IP) and retry."
      },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
