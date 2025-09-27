import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbVoxl7g8D06TiSvGHiFPOg_Tjxv1yaTE",
  authDomain: "smart-calendar-c33c1.firebaseapp.com",
  projectId: "smart-calendar-c33c1",
  storageBucket: "smart-calendar-c33c1.firebasestorage.app",
  messagingSenderId: "161693533111",
  appId: "1:161693533111:web:24fecb80eb288637569e32",
  measurementId: "G-SR12609JVL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
