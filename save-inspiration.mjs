import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const capture = {
  title: 'Idlewild Terminal (JFK) - Eero Saarinen 1956',
  content: `No, no es el cuartel de Hombres de negro, se trata del área de informes del aeropuerto Idlewild, mismo que ahora conocemos como John F. Kennedy, fue diseñado por Eero Saarinen en 1956, diseños ultramodernos de lo que se suponía sería el estilo del futuro tal y como nunca fue… Cualquier parecido con los supersónicos es mera coincidencia.`,
  type: 'link',
  metadata: {
    source: 'whatsapp',
    for: 'c13studio_instagram',
    tags: ['arquitectura', 'diseño', 'vintage', 'futurismo']
  }
};

try {
  const { data, error } = await supabase
    .from('captures')
    .insert([capture])
    .select();

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Nota guardada:', data[0].id);
  
  // Add to c13studio collection
  const collRes = await supabase
    .from('collections')
    .select('id')
    .eq('name', 'c13studio')
    .single();

  if (collRes.data) {
    await supabase
      .from('capture_collections')
      .insert({
        capture_id: data[0].id,
        collection_id: collRes.data.id
      });
    console.log('✅ Añadida a colección c13studio');
  }

  // Add to Inspiración category
  const catRes = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Inspiración')
    .single();

  if (catRes.data) {
    await supabase
      .from('captures')
      .update({ category_id: catRes.data.id })
      .eq('id', data[0].id);
    console.log('✅ Categorizada como Inspiración');
  }

} catch (err) {
  console.error('Fatal:', err);
  process.exit(1);
}
