import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

const hasCloudinary =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (hasCloudinary) {
    return new Promise<string>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "palpal-products", resource_type: "image" },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }
          resolve(result.secure_url);
        }
      );
      upload.end(buffer);
    });
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false
      });
    if (error) {
      throw error;
    }
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename);
    return data.publicUrl;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}
