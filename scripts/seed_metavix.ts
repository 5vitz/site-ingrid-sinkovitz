
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const videos = [
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F01.mp4?alt=media&token=19f0b135-718b-4e94-82a1-c5d1e080005c",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F03.mp4?alt=media&token=f9d51d7a-966c-4cc6-872a-8ce22d492b54",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F04.mp4?alt=media&token=27704524-5b1d-4835-9ac0-10033ff1078b",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F05.mp4?alt=media&token=523b5061-5011-401c-8c14-e7708433dbe8",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F05.mp4?alt=media&token=523b5061-5011-401c-8c14-e7708433dbe8",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F09.mp4?alt=media&token=3d656f3d-ad65-4f85-a921-6cbba0a2a3ab",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F27.mp4?alt=media&token=a7d800d2-1ee9-42f6-9f1e-056047929dac",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F28.mp4?alt=media&token=41b0d434-4cc8-4fa7-b427-9f6b7d58aefc",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F29.mp4?alt=media&token=0d19ec59-bfb1-47d9-9eaf-1dddb59425ac",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F18.mp4?alt=media&token=bc96c55d-0895-4c6a-a24f-b29c8aa7385d",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F23.mp4?alt=media&token=51c2e65d-3939-473f-8cc3-fcebb527f293",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F25.mp4?alt=media&token=044b72a8-90f3-4fa3-a735-a2828e3782df"
];

const mediaItems = videos.map((url, idx) => ({
  type: 'video',
  url: url,
  order: idx
}));

const metavix = {
  id: 'metavix-projeto',
  title: 'Metavix (Oficial)',
  description: 'Metavix - Social Media Video Collection',
  layoutType: 'vertical',
  galleryThumbnail: 'https://picsum.photos/seed/mv-oficial/800/1200',
  coverImage: 'https://picsum.photos/seed/mv-cover-oficial/1920/1080',
  thumbnailFit: 'cover',
  mediaItems: mediaItems,
  order: 1
};

async function seed() {
  try {
    await setDoc(doc(db, 'projects', metavix.id), metavix);
    console.log('Metavix project seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding project:', err);
    process.exit(1);
  }
}

seed();
