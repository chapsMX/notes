import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const targetCategories = [
  { name: 'reels', slug: 'reels', emoji: '🎬' },
  { name: 'inspiracion', slug: 'inspiracion', emoji: '✨' },
  { name: 'personal', slug: 'personal', emoji: '👤' },
  { name: 'recordatorios', slug: 'recordatorios', emoji: '⏰' },
  { name: 'referencias', slug: 'referencias', emoji: '🔖' },
  { name: 'trabajo', slug: 'trabajo', emoji: '💼' },
  { name: 'viajes', slug: 'viajes', emoji: '✈️' },
  { name: 'links', slug: 'links', emoji: '🔗' },
  { name: 'notas', slug: 'notas', emoji: '📝' }
];

try {
  const { data: existing } = await supabase
    .from('categories')
    .select('slug');

  const existingSlugs = existing?.map(c => c.slug) || [];
  const toInsert = targetCategories.filter(c => !existingSlugs.includes(c.slug));

  if (toInsert.length > 0) {
    const { data } = await supabase
      .from('categories')
      .insert(toInsert)
      .select();

    console.log(`✅ Insertadas ${toInsert.length} nuevas categorías`);
  }

  const { data: all } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  console.log('\n📊 Categorías finales:');
  all?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
