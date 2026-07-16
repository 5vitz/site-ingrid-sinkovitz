import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCqCMVtjA85264hL6YrvLKyqLdhFYoxJr4",
  authDomain: "gen-lang-client-0706232208.firebaseapp.com",
  projectId: "gen-lang-client-0706232208",
  storageBucket: "gen-lang-client-0706232208.firebasestorage.app",
  messagingSenderId: "1037474656399",
  appId: "1:1037474656399:web:28b4254eb03040974800fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {}, 'ai-studio-57a5e081-4b30-4bf4-9abf-af56b4ca8ae0');
export const storage = getStorage(app);

export default app;
