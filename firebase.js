// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFIACK_l_gZXXwIAdkN4z9HIDF56f9Ld0",
  authDomain: "study-portal-53435.firebaseapp.com",
  projectId: "study-portal-53435",
  storageBucket: "study-portal-53435.firebasestorage.app",
  messagingSenderId: "845172052991",
  appId: "1:845172052991:web:bf80c5cd45d446252ecdca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services
export { auth, db };