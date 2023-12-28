// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-8e978.firebaseapp.com",
  projectId: "mern-blog-8e978",
  storageBucket: "mern-blog-8e978.appspot.com",
  messagingSenderId: "1023875771828",
  appId: "1:1023875771828:web:6122f03a420a55a0af56e1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
