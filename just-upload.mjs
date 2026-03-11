import fs from 'fs';
import FormData from 'form-data';

const CLOUD_NAME = 'dtc59qmch';
const API_KEY = '24Zdm1FknYiSLFlbN3az7OPQHMU';

async function uploadToCloudinary(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const form = new FormData();
    form.append('file', fileBuffer, 'image.jpg');
    form.append('api_key', API_KEY);
    form.append('resource_type', 'auto');
    form.append('folder', 'chapsbox');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      { 
        method: 'POST', 
        body: form,
        headers: form.getHeaders()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Upload failed: ${text}`);
      return null;
    }
    
    const result = await response.json();
    return result.secure_url;
  } catch (err) {
    console.error('Upload error:', err.message);
    return null;
  }
}

const url = await uploadToCloudinary('/home/ubuntu/.openclaw/media/inbound/71bf1886-42c1-4d58-b5fe-da960209b0b2.jpg');
console.log(url);
