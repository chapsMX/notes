import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: cats } = await supabase
  .from('categories')
  .select('*')
  .order('name');

console.log('CATEGORÍAS ACTUALES:');
cats?.forEach(c => {
  console.log(`- ${c.emoji} ${c.name} (id: ${c.id})`);
});
