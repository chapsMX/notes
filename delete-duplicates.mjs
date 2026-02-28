import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

try {
  // Get all duplicates ordered by created_at
  const { data: duplicates } = await supabase
    .from('captures')
    .select('id, created_at')
    .ilike('title', '%Vehículos en ciclovía%')
    .order('created_at', { ascending: false });

  console.log(`Encontradas ${duplicates?.length || 0} notas duplicadas`);

  // Keep the last one (most recent), delete the rest
  if (duplicates && duplicates.length > 1) {
    const toDelete = duplicates.slice(1); // All except the first (most recent)
    
    for (const item of toDelete) {
      await supabase
        .from('captures')
        .delete()
        .eq('id', item.id);
      console.log(`✅ Eliminada copia: ${item.created_at}`);
    }

    console.log(`\n✅ Eliminadas ${toDelete.length} duplicadas. Quedan 1.`);
  }

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
