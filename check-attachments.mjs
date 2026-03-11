import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: attachments } = await supabase
  .from('attachments')
  .select('*')
  .limit(5);

console.log('📎 ATTACHMENTS SAMPLE:\n');
attachments?.forEach(a => {
  console.log(`ID: ${a.id}`);
  console.log(`URL: ${a.url}`);
  console.log(`Bucket: ${a.bucket || 'N/A'}`);
  console.log(`Path: ${a.path || 'N/A'}`);
  console.log('---');
});
