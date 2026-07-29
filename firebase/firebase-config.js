// Firebase Web SDK Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

export const firebaseConfig = {
    apiKey: "AIzaSyA4cYzkHspN1nv1iumK3ooAZ3APaDlgRgQ",
    authDomain: "portfolio-4d3bb.firebaseapp.com",
    projectId: "portfolio-4d3bb",
    storageBucket: "portfolio-4d3bb.firebasestorage.app",
    messagingSenderId: "445507061953",
    appId: "1:445507061953:web:15bd8b80111ace534aec40",
    measurementId: "G-5YJFW9DP38"};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
