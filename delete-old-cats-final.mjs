import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const oldCategoryNames = [
  'Cafeterías',
  'Chaps',
  'Finanzas',
  'General',
  'Inspiración',
  'memes',
  'Restaurantes',
  'Supermercado'
];

try {
  const { data: allCats } = await supabase
    .from('categories')
    .select('id, name');

  const toDelete = allCats?.filter(c => oldCategoryNames.includes(c.name)) || [];

  console.log(`Eliminando ${toDelete.length} categorías viejas...\n`);

  for (const cat of toDelete) {
    // First, set category_id to null for captures in this category
    await supabase
      .from('captures')
      .update({ category_id: null })
      .eq('category_id', cat.id);

    // Then delete the category
    await supabase
      .from('categories')
      .delete()
      .eq('id', cat.id);

    console.log(`✅ Eliminada: ${cat.name}`);
  }

  // List remaining categories
  const { data: remaining } = await supabase
    .from('categories')
    .select('emoji, name')
    .order('name');

  console.log('\n✅ Categorías finales:');
  remaining?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
