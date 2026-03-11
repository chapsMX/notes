import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = `
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  reminder_at timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_reminder_at ON reminders(reminder_at);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read reminders" ON reminders;
DROP POLICY IF EXISTS "Users can create reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete reminders" ON reminders;

CREATE POLICY "Users can read reminders"
  ON reminders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update reminders"
  ON reminders FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete reminders"
  ON reminders FOR DELETE
  USING (auth.role() = 'authenticated');
`;

// Split into individual statements and execute each
const statements = sql.split(';').filter(s => s.trim());

try {
  console.log('Creando tabla reminders...\n');
  
  // We'll use a different approach - create via direct table operations
  // since we can't execute raw SQL via the API
  
  // Test with a simple insert to see if table needs creation
  const { error: createError } = await supabase
    .from('reminders')
    .insert({
      title: 'Test',
      reminder_at: new Date().toISOString(),
      status: 'pending'
    })
    .select();

  if (createError?.code === 'PGRST116' || createError?.message.includes('no rows')) {
    console.log('⚠️ Tabla no existe. Necesitas crear manualmente en Supabase SQL Editor.');
    console.log('\nPega esto en https://supabase.com/dashboard → SQL Editor:\n');
    console.log(sql);
    process.exit(1);
  } else if (createError) {
    console.error('Error:', createError);
    process.exit(1);
  }

  console.log('✅ Tabla reminders verificada y funcional');

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
