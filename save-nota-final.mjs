import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

const imageUrl = 'https://res.cloudinary.com/dtc59qmch/image/upload/v1772305425/chapsbox/s0acn7xrlagn7genkte2.jpg';
const notasId = 'debfa1a3-82af-42ef-b7f5-0a98bac13ae9';

async function main() {
  try {
    // Save capture
    const { data } = await supabase
      .from('captures')
      .insert({
        title: 'Vehículos en ciclovía - Queja',
        content: 'enviar tuit para queja sobre vehiculos estacionados en ciclovia, incluir alcaldesa y autoridad',
        type: 'image',
        category_id: notasId,
        source_url: imageUrl,
        source_platform: 'cloudinary'
      })
      .select();

    const captureId = data[0].id;
    console.log(`✅ Captura creada`);

    // Add tags with slug
    const tagNames = ['quejas', 'personal'];

    for (const tagName of tagNames) {
      const { data: existing } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName);

      if (!existing || existing.length === 0) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: tagName, slug: tagName })
          .select();
        
        if (newTag && newTag.length > 0) {
          await supabase
            .from('capture_tags')
            .insert({
              capture_id: captureId,
              tag_id: newTag[0].id
            });
        }
      } else {
        await supabase
          .from('capture_tags')
          .insert({
            capture_id: captureId,
            tag_id: existing[0].id
          });
      }
    }

    console.log('✅ Guardada en notas con tags: quejas, personal');

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
