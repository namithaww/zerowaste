import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCBGEiQl-IPJ3AWjLnVTlbMFzH3BRUKdZM",
    authDomain: "zerowaste-6b677.firebaseapp.com",
    projectId: "zerowaste-6b677",
    storageBucket: "zerowaste-6b677.firebasestorage.app",
    messagingSenderId: "634706012547",
    appId: "1:634706012547:web:ed9b36ab7f3daf774f2eb6",
    measurementId: "G-ZX0LYN870H"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export {app};