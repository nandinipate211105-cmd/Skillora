// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS OBJECT WITH YOUR KEYS FROM STEP 2:
const firebaseConfig = {
  apiKey: "AIzaSyB_7n4Ea5gkXJC6NH2L3VaiwxW0uMM84TE",
  authDomain: "skillora-7750d.firebaseapp.com",
  databaseURL: "https://skillora-7750d-default-rtdb.firebaseio.com",
  projectId: "skillora-7750d",
  storageBucket: "skillora-7750d.firebasestorage.app",
  messagingSenderId: "710793719794",
  appId: "1:710793719794:web:b434323e8e6c0aaf87056b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export tools to use across the project
export const auth = getAuth(app);
export const db = getFirestore(app);