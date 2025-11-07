// Script simples para criar bucket generated-previews
// Uso: node scripts/create-preview-bucket-simple.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler .env file manualmente
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🚀 Creating generated-previews bucket...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  try {
    // Listar buckets existentes
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      process.exit(1);
    }

    const exists = buckets.some(b => b.name === 'generated-previews');
    
    if (exists) {
      console.log('✅ Bucket generated-previews already exists!');
      return;
    }

    // Criar bucket
    const { data, error } = await supabase.storage.createBucket('generated-previews', {
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg']
    });

    if (error) {
      console.error('❌ Error creating bucket:', error);
      process.exit(1);
    }

    console.log('✅ Successfully created generated-previews bucket!');
    console.log('📦 Bucket:', data);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

main();
