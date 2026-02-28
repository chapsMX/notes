import fetch from 'node:fetch';
import fs from 'node:fs';
import path from 'node:path';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;

export async function uploadImageToCloudinary(filePath) {
  if (!CLOUD_NAME || !API_KEY) {
    throw new Error('Cloudinary credentials missing');
  }

  try {
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    // Create form data
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), fileName);
    formData.append('api_key', API_KEY);
    formData.append('resource_type', 'auto');
    formData.append('folder', 'chapsbox');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.secure_url;

  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    throw err;
  }
}

// Test
async function test() {
  console.log('✅ Cloudinary module ready');
  console.log(`Cloud: ${CLOUD_NAME}`);
}

test();
