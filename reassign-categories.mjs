import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const mappings = {
  reels: [
    '5 Cafeterías',
    'Pancakes',
    'Escala - Requiem',
    'Reel de transiciones',
    'Reveal vertical',
    'Cómo romperla en YouTube'
  ],
  inspiracion: [
    'Idlewild Terminal',
    'Casa brutalista'
  ],
  personal: [
    'VOY AL OXXO',
    'Llamada: Verticali',
    'Llamada: SE RENTA',
    'Departamento',
    'Pago de Renta'
  ],
  recordatorios: [
    'Cancelar suscripciones',
    'Llamada con Tony'
  ],
  referencias: [
    'Lex Fridman',
    'CoinbaseDev',
    'GSD',
    '2 Nichos rentables'
  ],
  trabajo: [
    'AI Adoption',
    'Ciclo de BaseApp'
  ]
};

try {
  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug');

  const catMap = {};
  categories?.forEach(c => {
    catMap[c.slug] = c.id;
  });

  let totalUpdated = 0;

  for (const [slug, titles] of Object.entries(mappings)) {
    const categoryId = catMap[slug];
    
    for (const title of titles) {
      const { data } = await supabase
        .from('captures')
        .select('id')
        .ilike('title', `%${title}%`)
        .limit(1);

      if (data && data.length > 0) {
        await supabase
          .from('captures')
          .update({ category_id: categoryId })
          .eq('id', data[0].id);
        
        console.log(`✅ "${title}" → 📦 ${slug}`);
        totalUpdated++;
      }
    }
  }

  console.log(`\n✅ ${totalUpdated} capturas reasignadas`);

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
