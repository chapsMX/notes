import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

try {
  // List files in captures bucket
  const { data, error } = await supabase
    .storage
    .from('captures')
    .list();

  if (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️ El bucket "captures" no existe o no está accesible');
    console.log('Necesitamos crear el bucket en Supabase');
    process.exit(1);
  }

  console.log(`✅ Bucket "captures" existe`);
  console.log(`📦 Archivos: ${data?.length || 0}`);
  data?.forEach(f => {
    console.log(`  - ${f.name}`);
  });

} catch (err) {
  console.error('Fatal:', err);
}
