import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data } = await supabase
  .from('categories')
  .select('id, name, emoji')
  .order('name');

console.log(`Total: ${data?.length} categorías\n`);
data?.forEach(c => {
  console.log(`${c.emoji || '❓'} ${c.name} (${c.id})`);
});
