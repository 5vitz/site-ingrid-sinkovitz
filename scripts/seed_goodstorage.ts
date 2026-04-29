import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const videos = [
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2FEloBike_01.mp4?alt=media&token=8eb6b3d4-8d4e-4f3b-8b9a-7c9d6e5f4a3b",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2FEloBike_02.mp4?alt=media&token=7d5c4b3a-9e8d-4f2c-1a0b-9c8d7e6f5a4b",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2FEloBike_03.mp4?alt=media&token=6b5a4d3c-2e1f-0b9a-8c7d-6e5f4a3b2c1d"
];

const mediaItems = videos.map((url, idx) => ({
  type: 'video',
  url: url,
  order: idx
}));

const goodstorage = {
  id: 'goodstorage-projeto',
  title: 'GoodStorage (Oficial)',
  description: 'GoodStorage - Soluções Inteligentes de Armazenamento\nGestão de conteúdo estratégico para expansão de marca.',
  layoutType: 'vertical',
  galleryThumbnail: 'https://picsum.photos/seed/gs-oficial/800/1200',
  coverImage: 'https://picsum.photos/seed/gs-cover-oficial/1920/1080',
  thumbnailFit: 'cover',
  mediaItems: mediaItems,
  order: 2
};

async function seed() {
  try {
    await setDoc(doc(db, 'projects', goodstorage.id), goodstorage);
    console.log('GoodStorage project seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding project:', err);
    process.exit(1);
  }
}

seed();
