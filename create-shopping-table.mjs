import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `
CREATE TABLE IF NOT EXISTS shopping_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shopping_list_status ON shopping_list(status);

ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read shopping list" ON shopping_list;
DROP POLICY IF EXISTS "Users can create items" ON shopping_list;
DROP POLICY IF EXISTS "Users can update items" ON shopping_list;
DROP POLICY IF EXISTS "Users can delete items" ON shopping_list;

CREATE POLICY "Users can read shopping list"
  ON shopping_list FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create items"
  ON shopping_list FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update items"
  ON shopping_list FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete items"
  ON shopping_list FOR DELETE
  USING (auth.role() = 'authenticated');
`;

try {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'apikey': serviceKey
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  console.log('✅ Tabla shopping_list creada exitosamente');

} catch (err) {
  console.error('Error:', err.message);
  
  // Fallback: intentar crear con raw insert
  console.log('\nIntentando crear tabla con método alternativo...');
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      }
    });
    
    if (response.ok) {
      console.log('✅ Conexión a Supabase OK - Por favor ejecuta el SQL manualmente en el dashboard');
      console.log('URL: https://supabase.com/dashboard');
    }
  } catch (e) {
    console.error('No se pudo conectar a Supabase');
  }
}
