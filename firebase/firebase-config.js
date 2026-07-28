// Firebase Web SDK Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

export const firebaseConfig = {
  projectId: "skillful-gear-8dpgw",
  appId: "1:752152599090:web:7b6c6aa5814e5fb4bbfa2b",
  apiKey: "AIzaSyCRaMkQV5c5V3nOZGuVIN-nlt4pYfVLQtg",
  authDomain: "skillful-gear-8dpgw.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-djchaudharyportf-763d84d6-2164-44d6-82c2-4390c7569014",
  storageBucket: "skillful-gear-8dpgw.firebasestorage.app",
  messagingSenderId: "752152599090",
  oAuthClientId: "752152599090-cmm37fl032lqua0rgo6mot9cd9jb7noc.apps.googleusercontent.com",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
