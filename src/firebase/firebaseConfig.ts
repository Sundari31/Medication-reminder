import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2zmXiWRMUZgJZbpGIYp-eC_XZmLY0KLc",
  authDomain: "medication-8859a.firebaseapp.com",
  projectId: "medication-8859a",
  storageBucket: "medication-8859a.firebasestorage.app",
  messagingSenderId: "861511097603",
  appId: "1:861511097603:web:957e7773fedfdd33575d36"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
