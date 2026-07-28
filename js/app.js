/**
 * DJ Chaudhary Portfolio Engine — Firebase Firestore & Auth Integration
 *
 * This module connects the portfolio frontend with Firebase Firestore to:
 * 1. Automatically fetch and sync Projects, Skills, Experience, and Testimonials in real time.
 * 2. Store contact form submissions directly into the 'messages' Firestore collection.
 * 3. Fall back gracefully to local default data if offline or initializing.
 */

import { db } from './firebase-config.js';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Subscribe to real-time updates for any collection
export function listenToCollection(collectionName, callback) {
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const docs = [];
      snapshot.forEach((d) => {
        docs.push({ id: d.id, ...d.data() });
      });
      callback(docs);
    },
    (err) => {
      console.warn(`Firestore listener warning for ${collectionName}:`, err);
    }
  );
}

// Send contact message to Firestore
export async function sendContactMessage(formData) {
  const messagesRef = collection(db, 'messages');
  return await addDoc(messagesRef, {
    ...formData,
    read: false,
    timestamp: new Date().toISOString(),
    createdAt: serverTimestamp()
  });
}
