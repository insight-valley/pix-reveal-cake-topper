/**
 * Script para criar bucket generated-previews no Supabase Storage
 * 
 * Usage: NEXT_PUBLIC_SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=yyy node scripts/setup-preview-bucket.mjs
 * Or load .env first: source .env && node scripts/setup-preview-bucket.mjs
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupPreviewBucket() {
  console.log("🚀 Setting up generated-previews bucket...");

  try {
    // Verificar se bucket já existe
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Error listing buckets:", listError);
      process.exit(1);
    }

    const bucketExists = buckets.some(
      (bucket) => bucket.name === "generated-previews"
    );

    if (bucketExists) {
      console.log("✅ Bucket 'generated-previews' already exists!");
      return;
    }

    // Criar bucket
    const { data, error } = await supabase.storage.createBucket(
      "generated-previews",
      {
        public: false,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/jpg"],
      }
    );

    if (error) {
      console.error("❌ Error creating bucket:", error);
      process.exit(1);
    }

    console.log("✅ Successfully created 'generated-previews' bucket!");
    console.log("📦 Bucket configuration:", data);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

// Run setup
setupPreviewBucket();
