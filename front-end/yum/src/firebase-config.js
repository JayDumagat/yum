// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoBpF9oyehdKSOB2KTPXYx_W4LXTzdt7Q",
  authDomain: "gym-membership-3b0ab.firebaseapp.com",
  projectId: "gym-membership-3b0ab",
  storageBucket: "gym-membership-3b0ab.appspot.com",
  messagingSenderId: "834895588676",
  appId: "1:834895588676:web:03da14a614a377ab49fb11",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
