import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD18Z6oIzOUVsaoXwGHqEZWQWJe1msBMR0",
  authDomain: "testmaxx-platform.firebaseapp.com",
  projectId: "testmaxx-platform",
  storageBucket: "testmaxx-platform.firebasestorage.app",
  messagingSenderId: "738503894220",
  appId: "1:738503894220:web:6775dfd696d73434094e69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;