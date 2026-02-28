import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

try {
  // Parse: lunes 2 marzo 16:45 CDMX
  // 2026-03-02 16:45 CDMX = 2026-03-02 22:45 UTC
  const reminderDate = new Date('2026-03-02T16:45:00');
  // Convert CDMX to UTC (+6 hours)
  const utcDate = new Date(reminderDate.getTime() + (6 * 60 * 60 * 1000));

  const { data, error } = await supabase
    .from('reminders')
    .insert({
      title: 'Cita con Elena Argüelles',
      content: 'Cita a las 16:45',
      reminder_at: utcDate.toISOString(),
      status: 'pending'
    })
    .select();

  if (error) throw error;

  console.log(`✅ Recordatorio guardado`);
  console.log(`📅 Lunes 2 de marzo a las 16:45 CDMX`);
  console.log(`👤 Elena Argüelles`);

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
