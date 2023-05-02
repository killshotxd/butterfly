// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_API_KEY,
  authDomain: import.meta.env.VITE_FIRE_AUTH_DOM,
  projectId: import.meta.env.VITE_FIRE_PRJ_ID,
  storageBucket: import.meta.env.VITE_FIRE_STG_BKT,
  messagingSenderId: import.meta.env.VITE_FIRE_MSG_ID,
  appId: import.meta.env.VITE_FIRE_APP_ID,
  measurementId: import.meta.env.VITE_FIRE_MESG_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
