import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const categoriesToDelete = ['Cafeterías', 'Chaps', 'Finanzas', 'General', 'Inspiración', 'memes', 'Restaurantes', 'Supermercado'];

try {
  for (const catName of categoriesToDelete) {
    const { data } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', catName)
      .single();

    if (data) {
      await supabase
        .from('categories')
        .delete()
        .eq('id', data.id);
      console.log(`✅ Eliminada: ${catName}`);
    }
  }

  console.log('\n✅ Categorías finales:');
  const { data: final } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  final?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
