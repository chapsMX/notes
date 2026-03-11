import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

const { data } = await supabase
  .from('attachments')
  .select()
  .limit(1);

if (data && data.length > 0) {
  console.log('Estructura de attachments:');
  Object.keys(data[0]).forEach(key => {
    console.log(`  - ${key}`);
  });
} else {
  console.log('No hay attachments para ver la estructura');
}
