import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigManual from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigManual.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigManual.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigManual.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigManual.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigManual.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigManual.appId,
};

let app;
let auth;
let db;
let storage;
const googleProvider = new GoogleAuthProvider();

try {
  // Check if mandatory fields are actually present before initializing
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    throw new Error('Firebase API Key is missing or invalid.');
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigManual.firestoreDatabaseId;
  if (dbId && dbId !== 'undefined') {
    db = getFirestore(app, dbId);
  } else {
    db = getFirestore(app); // Fallback to default database
  }
  
  storage = getStorage(app);
} catch (error) {
  console.error('CRITICAL: Firebase failed to initialize:', error);
}

export { auth, db, storage, googleProvider };
