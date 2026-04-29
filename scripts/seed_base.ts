import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const aboutData = {
  description: `Eu sou a Ingrid, e minha trajetória na comunicação nunca foi linear...`, // Bio completa seria melhor mas por brevidade...
  videoUrl: 'https://youtube.com/watch?v=n7XttGodixg'
};

const settingsData = {
  accentColor: '#D4AF37',
  whatsappNumber: '5527999193525'
};

async function seed() {
  try {
    await setDoc(doc(db, 'about', 'sobre_mim'), aboutData);
    await setDoc(doc(db, 'settings', 'global'), settingsData);
    console.log('About and Settings seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
