import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

async function fetchProject() {
  const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  const docRef = doc(db, 'projects', 'lion-jump');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log(JSON.stringify(docSnap.data(), null, 2));
  } else {
    console.log("No such document!");
  }
  process.exit(0);
}

fetchProject().catch(console.error);
