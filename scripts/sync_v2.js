import https from 'https';
import fs from 'fs';
import path from 'path';

const filesToSync = [
  'src/App.tsx',
  'src/index.css',
  'src/types.ts',
  'src/components/ContactSection.tsx',
  'src/components/ProjectModalFlow.tsx',
  'src/components/ProjectSection.tsx',
  'src/components/AboutMeSection.tsx',
  'src/components/ServicesSection.tsx',
  'src/components/TestimonialsSection.tsx',
  'src/components/Admin/AdminPanel.tsx',
  'src/components/Admin/ProjectManager.tsx',
  'src/components/Admin/FlowConstructor.tsx',
  'src/components/Admin/MediaManager.tsx',
  'src/components/Admin/ContactManager.tsx',
  'src/components/Admin/GlobalSettingsManager.tsx',
  'src/components/Admin/AdminLogin.tsx',
  'src/components/MediaRenderer.tsx',
  'src/components/PDFViewer.tsx',
  'src/services/dataService.ts',
  'ARQUITETURA_PROJETO.md',
  'AGENTS.md'
];

const baseUrl = 'https://raw.githubusercontent.com/5vitz/site-ingrid-sinkovitz/main/';

async function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode} para ${url}`));
        return;
      }
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const fileStream = fs.createWriteStream(targetPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`OK: ${targetPath}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function sync() {
  console.log('Iniciando Sincronização...');
  for (const file of filesToSync) {
    try {
      await downloadFile(baseUrl + file, file);
    } catch (err) {
      console.error(`ERRO em ${file}:`, err.message);
    }
  }
  console.log('Sincronização Concluída.');
}

sync();
