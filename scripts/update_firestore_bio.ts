import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { aboutData } from '../src/data/aboutData';

const firebaseConfig = {
  apiKey: "AIzaSyCqCMVtjA85264hL6YrvLKyqLdhFYoxJr4",
  authDomain: "gen-lang-client-0706232208.firebaseapp.com",
  projectId: "gen-lang-client-0706232208",
  storageBucket: "gen-lang-client-0706232208.firebasestorage.app",
  messagingSenderId: "1037474656399",
  appId: "1:1037474656399:web:28b4254eb03040974800fa"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, 'ai-studio-57a5e081-4b30-4bf4-9abf-af56b4ca8ae0');
const auth = getAuth(app);

async function run() {
  console.log("Authenticating as admin...");
  await signInWithEmailAndPassword(auth, 'sinkando@gmail.com', 'Ingrid2026!');
  console.log("Authenticated successfully.");

  console.log("Updating biography in Firestore...");
  const docRef = doc(db, 'settings', 'mainSettings');
  
  let currentData = {};
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      currentData = snap.data();
    }
  } catch (e) {
    console.log("No existing settings doc found or error:", e);
  }

  const updatedSettings = {
    ...currentData,
    name: aboutData.name,
    role: aboutData.role,
    tagline: aboutData.tagline,
    paragraphs: aboutData.paragraphs,
    version: 3
  };

  await setDoc(docRef, updatedSettings);
  console.log("Successfully updated settings/mainSettings document in Firestore!");
  process.exit(0);
}

run().catch(e => {
  console.error("Failed to update:", e);
  process.exit(1);
});
