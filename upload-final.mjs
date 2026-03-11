import fetch from 'node:fetch';
import fs from 'node:fs';
import path from 'node:path';

const CLOUD_NAME = 'dtc59qmch';
const API_KEY = '24Zdm1FknYiSLFlbN3az7OPQHMU';

async function uploadImageToCloudinary(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), fileName);
    formData.append('api_key', API_KEY);
    formData.append('resource_type', 'auto');
    formData.append('folder', 'chapsbox');

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

const url = await uploadImageToCloudinary('/home/ubuntu/.openclaw/media/inbound/71bf1886-42c1-4d58-b5fe-da960209b0b2.jpg');
console.log(url);
