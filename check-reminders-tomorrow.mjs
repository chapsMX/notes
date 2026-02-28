import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

// Get tomorrow in CDMX
const now = new Date();
const cdmxTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));

const tomorrow = new Date(cdmxTime);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const nextDay = new Date(tomorrow);
nextDay.setDate(nextDay.getDate() + 1);
nextDay.setHours(0, 0, 0, 0);

// Convert to UTC
const tomorrowUTC = new Date(tomorrow.getTime() - (6 * 60 * 60 * 1000));
const nextDayUTC = new Date(nextDay.getTime() - (6 * 60 * 60 * 1000));

console.log(`🕐 Hoy CDMX: ${cdmxTime.toLocaleString('es-MX')}`);
console.log(`🕐 Mañana CDMX: ${tomorrow.toLocaleString('es-MX')}`);
console.log(`🕐 Mañana UTC: ${tomorrowUTC.toISOString()}`);
console.log(`🕐 Pasado mañana UTC: ${nextDayUTC.toISOString()}\n`);

const { data: reminders } = await supabase
  .from('reminders')
  .select('*')
  .eq('status', 'pending')
  .gte('reminder_at', tomorrowUTC.toISOString())
  .lt('reminder_at', nextDayUTC.toISOString())
  .order('reminder_at', { ascending: true });

if (reminders && reminders.length > 0) {
  console.log(`✅ Recordatorios para mañana (${reminders.length}):`);
  reminders.forEach(r => {
    const time = new Date(r.reminder_at).toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    console.log(`  - ${r.title} (${time})`);
  });
} else {
  console.log('ℹ️ No hay recordatorios para mañana');
}
