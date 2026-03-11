import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newCategories = [
  { name: 'reels', emoji: '🎬' },
  { name: 'inspiracion', emoji: '✨' },
  { name: 'personal', emoji: '👤' },
  { name: 'recordatorios', emoji: '⏰' },
  { name: 'referencias', emoji: '🔖' },
  { name: 'trabajo', emoji: '💼' },
  { name: 'viajes', emoji: '✈️' },
  { name: 'links', emoji: '🔗' },
  { name: 'notas', emoji: '📝' }
];

try {
  // Delete old categories
  const { data: oldCats } = await supabase
    .from('categories')
    .select('id');

  if (oldCats) {
    for (const cat of oldCats) {
      await supabase
        .from('categories')
        .delete()
        .eq('id', cat.id);
    }
  }

  // Insert new categories
  const { data: inserted } = await supabase
    .from('categories')
    .insert(newCategories)
    .select();

  console.log('✅ Categorías creadas:');
  inserted?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
