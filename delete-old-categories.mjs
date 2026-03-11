import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const toDelete = ['cafeterias', 'chaps', 'finanzas', 'general', 'inspiracion', 'memes', 'restaurantes', 'supermercado'];

try {
  for (const slug of toDelete) {
    await supabase
      .from('categories')
      .delete()
      .ilike('slug', slug);
    console.log(`✅ Eliminada: ${slug}`);
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
