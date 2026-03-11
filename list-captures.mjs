import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: captures } = await supabase
  .from('captures')
  .select('id, title, content, type, source_platform, source_url')
  .order('created_at', { ascending: false });

console.log('📋 CAPTURAS EXISTENTES:\n');
captures?.forEach((c, i) => {
  console.log(`${i + 1}. "${c.title}"`);
  console.log(`   Type: ${c.type} | Platform: ${c.source_platform || 'local'}`);
  if (c.source_url) console.log(`   URL: ${c.source_url}`);
  if (c.content) console.log(`   Preview: ${c.content.substring(0, 60)}...`);
  console.log();
});
