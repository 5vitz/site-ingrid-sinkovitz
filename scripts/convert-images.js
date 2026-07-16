import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root path to public/fotos
const FOTOS_DIR = path.join(__dirname, '../public/fotos');

const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function convertDir(dirPath) {
  console.log(`Checking directory: ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory does not exist: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectory
      await convertDir(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        const baseName = path.basename(file, ext);
        const webpPath = path.join(dirPath, `${baseName}.webp`);

        console.log(`Converting: ${file} -> ${baseName}.webp`);
        
        try {
          // Convert image to WebP with 85% quality
          await sharp(fullPath)
            .webp({ quality: 85 })
            .toFile(webpPath);
            
          console.log(`Successfully converted to WebP: ${baseName}.webp`);
          
          // Delete the original file to free up space
          fs.unlinkSync(fullPath);
          console.log(`Deleted original: ${file}`);
        } catch (error) {
          console.error(`Failed to convert ${file}:`, error);
        }
      }
    }
  }
}

async function main() {
  console.log('--- Starting WebP Image Conversion ---');
  await convertDir(FOTOS_DIR);
  console.log('--- WebP Conversion Complete ---');
}

main().catch(console.error);
