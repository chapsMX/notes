import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

try {
  // Mañana 1 de marzo 10:30 CDMX
  const citaDate = new Date('2026-03-01T10:30:00');
  // Convert CDMX to UTC (+6 hours)
  const utcDate = new Date(citaDate.getTime() + (6 * 60 * 60 * 1000));

  const { data, error } = await supabase
    .from('reminders')
    .insert({
      title: 'Cita en Xola 304',
      content: 'Ubicación: Xola 304, Del Valle Norte, Benito Juárez',
      reminder_at: utcDate.toISOString(),
      status: 'pending'
    })
    .select();

  if (error) throw error;

  console.log(`✅ Cita guardada`);
  console.log(`📅 Mañana 1 de marzo a las 10:30`);
  console.log(`📍 Xola 304, Del Valle Norte, Benito Juárez`);

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
