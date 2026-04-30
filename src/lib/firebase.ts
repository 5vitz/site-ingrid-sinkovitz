import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_FIRESTORE_DATABASE_ID'
];

const missingVars = requiredVars.filter(v => !import.meta.env[v]);
if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars.join(', '));
}

let app;
let auth;
let db;
let storage;
const googleProvider = new GoogleAuthProvider();

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // Check if mandatory fields are actually present before initializing
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    throw new Error('Firebase API Key is missing or invalid.');
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID;
  if (dbId && dbId !== 'undefined') {
    db = getFirestore(app, dbId);
  } else {
    db = getFirestore(app); // Fallback to default database
  }
  
  storage = getStorage(app);
} catch (error) {
  console.error('CRITICAL: Firebase failed to initialize:', error);
  // We'll export empty/mock objects to prevent other components from crashing immediately,
  // but the console will have the real error.
}

export { auth, db, storage, googleProvider };

// Test connection silently
import { doc, getDocFromServer } from 'firebase/firestore';
async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Fail silently in UI, but log for devs
    console.warn("Firebase connectivity test failed. This is expected if rules aren't set yet.");
  }
}
testConnection();
