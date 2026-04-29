import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function cleanProjects() {
  try {
    const q = collection(db, 'projects');
    const snapshot = await getDocs(q);
    
    console.log(`Deleting ${snapshot.size} projects...`);
    
    const deletions = snapshot.docs.map(d => deleteDoc(doc(db, 'projects', d.id)));
    await Promise.all(deletions);
    
    console.log('Projects collection cleaned successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning projects:', err);
    process.exit(1);
  }
}

cleanProjects();
