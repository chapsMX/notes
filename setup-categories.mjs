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
  // First, update existing categories
  const { data: existing } = await supabase
    .from('categories')
    .select('*');

  console.log('Actualizando categorías existentes...');
  
  for (const newCat of newCategories) {
    const existingCat = existing?.find(c => c.name === newCat.name);
    
    if (existingCat) {
      // Update emoji if different
      if (existingCat.emoji !== newCat.emoji) {
        await supabase
          .from('categories')
          .update({ emoji: newCat.emoji })
          .eq('id', existingCat.id);
        console.log(`  ✏️ ${newCat.emoji} ${newCat.name} (actualizado)`);
      }
    } else {
      // Create new category
      await supabase
        .from('categories')
        .insert([newCat]);
      console.log(`  ✨ ${newCat.emoji} ${newCat.name} (creado)`);
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
