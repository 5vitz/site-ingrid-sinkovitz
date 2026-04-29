import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function dumpAll() {
  const collections = ['projects', 'media', 'about', 'settings'];
  for (const coll of collections) {
    console.log(`--- Collection: ${coll} ---`);
    try {
      const q = collection(db, coll);
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        console.log(`ID: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    } catch (e) {
      console.log(`Error reading ${coll}: ${e.message}`);
    }
  }
  process.exit(0);
}

dumpAll();
