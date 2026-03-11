import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

try {
  // Test insert
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 1);
  
  const { data, error } = await supabase
    .from('reminders')
    .insert({
      title: 'Test Reminder',
      content: 'This is a test',
      reminder_at: testDate.toISOString(),
      status: 'pending'
    })
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Tabla reminders verificada y funcional');
  console.log(`✅ Test insert exitoso: "${data[0].title}"`);

  // Delete test
  await supabase
    .from('reminders')
    .delete()
    .eq('id', data[0].id);

  console.log('✅ Listo para usar');

} catch (err) {
  console.error('Fatal:', err.message);
  process.exit(1);
}
