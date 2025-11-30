import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Senin Firebase Config Kodların Buraya Gelecek
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pati-dostu-efe.firebaseapp.com",
  projectId: "pati-dostu-efe",
  storageBucket: "pati-dostu-efe.firebasestorage.app",
  messagingSenderId: "909610214454",
  appId: "1:909610214454:web:a5f19dbce6ff74a4bf2497",
  measurementId: "G-S5KKH5TNG8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);