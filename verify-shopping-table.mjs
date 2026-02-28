import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

try {
  // Test insert
  const { data, error } = await supabase
    .from('shopping_list')
    .insert({ item: 'Test item' })
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Tabla shopping_list verificada y funcional');
  console.log(`✅ Test insert exitoso: ${data[0].item}`);

  // Delete test item
  await supabase
    .from('shopping_list')
    .delete()
    .eq('id', data[0].id);

  console.log('✅ Listo para usar');

} catch (err) {
  console.error('Fatal:', err.message);
  process.exit(1);
}
