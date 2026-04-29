import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const videos = [
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F01.mp4?alt=media&token=8fc725cf-90f7-41a6-98ed-773df4ea20f8",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F02.mp4?alt=media&token=e858db1f-298a-40a2-9721-6f015b6de23c",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F05.mp4?alt=media&token=60a373ca-05e8-46dc-a739-e47e30737a28",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F06.mp4?alt=media&token=36a0fb4f-6d0b-46cb-84fb-4f243be4c5e3",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F08.mp4?alt=media&token=bc8c6913-c918-472d-8bed-a83d35ae6786",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F11.mp4?alt=media&token=54ec5a6c-9c7f-4318-9717-36e6ba90022d",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F12.mp4?alt=media&token=e83e9b62-671c-403d-82d2-8b6b21c43552",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F13.mp4?alt=media&token=4289874a-2f47-49f3-8f08-8e6d1cde0550",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F14.mp4?alt=media&token=38520fdc-5989-4fc3-b295-d2abbb0439e0",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F16.mp4?alt=media&token=8f0ac23a-fcf7-4f6c-9eb9-be8f66858e72",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F17.mp4?alt=media&token=67b12d76-96b0-4663-b1da-35bc87b5a837",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F18.mp4?alt=media&token=67290bc5-6a84-486a-8b83-a9ae34eb99f6",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F19.mp4?alt=media&token=ae86bc3c-c9fa-4f51-b883-ec19572ef6d8",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F22.mp4?alt=media&token=4eb0814c-1e64-4e2b-8a8b-df174a787cd5"
];

const mediaItems = videos.map((url, idx) => ({
  type: 'video',
  url: url,
  order: idx
}));

const elobike = {
  id: 'elobike-projeto',
  title: 'EloBike (Oficial)',
  description: 'EloBike - Mobilidade e Estilo de Vida Urbano\nProdução Audiovisual com foco em Motion e Performance.\nNavegação Híbrida (Horizontal/Vertical).',
  layoutType: 'horizontal',
  galleryThumbnail: 'https://picsum.photos/seed/elobike-oficial/1200/800',
  coverImage: 'https://picsum.photos/seed/elobike-cover-oficial/1920/1080',
  thumbnailFit: 'cover',
  mediaItems: mediaItems,
  order: 3
};

async function seed() {
  try {
    await setDoc(doc(db, 'projects', elobike.id), elobike);
    console.log('EloBike project seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding project:', err);
    process.exit(1);
  }
}

seed();
