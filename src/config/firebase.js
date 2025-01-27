// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDl73NyMbcgbQTcztEj6ewqXRyJFbEoh2c",
  authDomain: "tvh-icep.firebaseapp.com",
  projectId: "tvh-icep",
  storageBucket: "tvh-icep.firebasestorage.app",
  messagingSenderId: "371444913400",
  appId: "1:371444913400:web:5e9c84b94c4913eb2dd70d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const storage = getStorage(app)

export {storage, db, analytics}