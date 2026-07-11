import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

// Initialize ImageKit client
const client = new ImageKit({
  privateKey:config.IMAGEKIT_PRIVATE_KEY,
});

// Function to upload a file to ImageKit
export async function uploadFile({buffer, fileName, folder = "velmora"}) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}