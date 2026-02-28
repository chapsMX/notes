import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

const { data: cats } = await supabase
  .from('categories')
  .select('*');

console.log('Categorías:');
cats?.forEach(c => {
  console.log(`${c.emoji} ${c.name} (slug: ${c.slug}, id: ${c.id})`);
});
