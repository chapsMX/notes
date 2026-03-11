import fs from 'fs';
import pkg from 'form-data';
const { FormData: FormDataNode } = pkg;

const CLOUD_NAME = 'dtc59qmch';
const API_KEY = '24Zdm1FknYiSLFlbN3az7OPQHMU';

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
