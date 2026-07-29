// Firebase Web SDK Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

export const firebaseConfig = {
  apiKey: "AIzaSyBQgxzdBtVt9iSc1pcd2Lz4eWFx6jk6vT0",
  authDomain: "namohtek.firebaseapp.com",
  databaseURL: "https://namohtek-default-rtdb.firebaseio.com",
  projectId: "namohtek",
  storageBucket: "namohtek.appspot.com",
  messagingSenderId: "17155029035",
  appId: "1:17155029035:web:f94c9363227f11f781926e",
  measurementId: "G-E54T39NQK6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
