
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ใส่ Firebase config ของคุณที่นี่
  apiKey: "AIzaSyDc1CUupVtPgbBpDBQKOrJGKQf8Jmtk29g",
  authDomain: "seobootx-55493.firebaseapp.com",
  projectId: "seobootx-55493",
  storageBucket: "seobootx-55493.firebasestorage.app",
  messagingSenderId: "643549529692",
  appId: "1:643549529692:web:b3abc2032e565d41758899"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
