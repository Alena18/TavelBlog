import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXA21Urb1RkVvFbInNrclq3duoMIoarUc",
  authDomain: "travelblog-8f4ed.firebaseapp.com",
  projectId: "travelblog-8f4ed",
  storageBucket: "travelblog-8f4ed.firebasestorage.app",
  messagingSenderId: "59567268557",
  appId: "1:59567268557:web:8ed25cbf70b8bb63e17f84",
  measurementId: "G-PRKC1PQEZ7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
