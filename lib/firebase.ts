// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnJe6h1cf8G8CR2VOMptOjzNB940fpCxA",
  authDomain: "groupe-tanou-international.firebaseapp.com",
  projectId: "groupe-tanou-international",
  storageBucket: "groupe-tanou-international.firebasestorage.app",
  messagingSenderId: "620692175628",
  appId: "1:620692175628:web:ed3a82892f848c6d68a729",
  measurementId: "G-FL42EMQCEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;