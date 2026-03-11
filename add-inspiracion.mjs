import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

try {
  // Check if inspiracion exists
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'inspiracion')
    .single();

  if (!existing) {
    const { data } = await supabase
      .from('categories')
      .insert({
        name: 'inspiracion',
        slug: 'inspiracion',
        emoji: '✨'
      })
      .select();

    console.log(`✅ Creada: ${data[0].name}`);
  } else {
    console.log('✅ inspiracion ya existe');
  }

  // List all
  const { data: all } = await supabase
    .from('categories')
    .select('emoji, name')
    .order('name');

  console.log('\n✅ Categorías finales (9):');
  all?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Error:', err);
}
