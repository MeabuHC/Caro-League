// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyumAouQEM_TdKQ5Kw9PtFbyqNVKo0xCA",
  authDomain: "caro-league.firebaseapp.com",
  projectId: "caro-league",
  storageBucket: "caro-league.firebasestorage.app",
  messagingSenderId: "193377155214",
  appId: "1:193377155214:web:f1f4df4422b6693854f1df",
  measurementId: "G-61W5WZ8Q31",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
