import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const shoppingItems = [
  'pimientos',
  'pan',
  'leche',
  'aguacates',
  'cebolla',
  'pollo',
  'arroz japonés',
  'kleenex cottonelle',
  'papel sanitario',
  'fibra para lavar',
  'jabón para trastes',
  'jabón para lavar trastes',
  'café en grano',
  '2 cabezas de ajo',
  'Ir al super'
];

try {
  for (const item of shoppingItems) {
    const { data } = await supabase
      .from('captures')
      .select('id')
      .ilike('title', `%${item}%`)
      .single();

    if (data) {
      await supabase
        .from('captures')
        .delete()
        .eq('id', data.id);
      console.log(`✅ Eliminado: "${item}"`);
    }
  }

  console.log('\n✅ Items de supermercado eliminados');

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
