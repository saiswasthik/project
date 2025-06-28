import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace with your actual Firebase config or use environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id"
};

// Debug Firebase configuration
// console.log('=== FIREBASE CONFIG DEBUG ===');
// console.log('Environment variables loaded:', {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing',
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? 'Present' : 'Missing',
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing',
//   appId: process.env.REACT_APP_FIREBASE_APP_ID ? 'Present' : 'Missing'
// });
console.log('Firebase config being used:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized successfully');

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
console.log('Firebase Auth initialized');

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);
console.log('Firestore initialized');

export default app; 