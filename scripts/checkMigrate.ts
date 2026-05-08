import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const d = await getDoc(doc(db, 'users_roles', 'sinkando@gmail.com'));
  if (d.exists()) {
    console.log('MIGRATE_SUCCESS');
  } else {
    console.log('MIGRATE_FAILED');
  }
}
check();
