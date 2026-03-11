import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newCategories = [
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
  const { data, error } = await supabase
    .from('categories')
    .insert(newCategories)
    .select();

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Nuevas categorías creadas:');
  data?.forEach(c => {
    console.log(`  ${c.emoji} ${c.name}`);
  });

} catch (err) {
  console.error('Fatal:', err);
  process.exit(1);
}
