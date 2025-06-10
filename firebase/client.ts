import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR3_2C3pue33X-2Q7oBPh9N6pZ3fxgdJg",
  authDomain: "interview-ninja-36875.firebaseapp.com",
  projectId: "interview-ninja-36875",
  storageBucket: "interview-ninja-36875.firebasestorage.app",
  messagingSenderId: "719876559750",
  appId: "1:719876559750:web:48d8e15d774b8b8e2b5207",
  measurementId: "G-FEFJ5SMQN7"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);