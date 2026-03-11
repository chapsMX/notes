import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

try {
  const { data: all } = await supabase
    .from('categories')
    .select('*');

  const idsToDelete = all
    ?.filter(c => ['Cafeterías', 'Chaps', 'Finanzas', 'General', 'Inspiración', 'memes', 'Restaurantes', 'Supermercado'].includes(c.name))
    .map(c => c.id) || [];

  console.log(`Eliminando ${idsToDelete.length} categorías...`);

  for (const id of idsToDelete) {
    await supabase
      .from('categories')
      .delete()
      .eq('id', id);
  }

  const { data: remaining } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  console.log('\n✅ Categorías finales:');
  remaining?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Error:', err);
}
