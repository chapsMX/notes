import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { FormData as FormDataNode } from 'form-data';

const CLOUD_NAME = 'dtc59qmch';
const API_KEY = '24Zdm1FknYiSLFlbN3az7OPQHMU';

const supabase = createClient(
  'https://btpkekugwwolvojquxdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cGtla3Vnd3dvbHZvanF1eGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY2ODYyNCwiZXhwIjoyMDg2MjQ0NjI0fQ.ufKlwoehMd8Hvw3lVMztYTY6QpPRtiJfTrwOaE17nM0'
);

async function uploadToCloudinary(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const formData = new FormDataNode();
    formData.append('file', fileBuffer, 'image.jpg');
    formData.append('api_key', API_KEY);
    formData.append('resource_type', 'auto');
    formData.append('folder', 'chapsbox');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      { 
        method: 'POST', 
        body: formData,
        headers: formData.getHeaders()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed: ${text}`);
    }
    
    const result = await response.json();
    return result.secure_url;
  } catch (err) {
    console.error('Upload error:', err.message);
    throw err;
  }
}

async function main() {
  try {
    // Upload image
    console.log('Subiendo imagen a Cloudinary...');
    const imageUrl = await uploadToCloudinary('/home/ubuntu/.openclaw/media/inbound/43bf1f2c-39bb-45d9-a7a0-b33ced9baaf6.jpg');
    console.log(`✅ Imagen subida: ${imageUrl.substring(0, 50)}...`);

    // Get category
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'notas')
      .single();

    // Save capture
    const { data, error } = await supabase
      .from('captures')
      .insert({
        title: 'Vehículos en ciclovía - Queja',
        content: 'enviar tuit para queja sobre vehiculos estacionados en ciclovia, incluir alcaldesa y autoridad',
        type: 'image',
        category_id: cat.id,
        source_platform: 'local'
      })
      .select();

    if (error) throw error;

    const captureId = data[0].id;

    // Add attachment
    await supabase
      .from('attachments')
      .insert({
        capture_id: captureId,
        url: imageUrl,
        type: 'image'
      });

    // Add tags
    for (const tagName of ['quejas', 'personal']) {
      let { data: tag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single()
        .catch(() => ({ data: null }));

      if (!tag) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: tagName })
          .select()
          .single();
        tag = newTag;
      }

      await supabase
        .from('capture_tags')
        .insert({
          capture_id: captureId,
          tag_id: tag.id
        });
    }

    console.log(`✅ Guardada en notas con tags: quejas, personal`);

  } catch (err) {
    console.error('Fatal:', err);
    process.exit(1);
  }
}

main();
