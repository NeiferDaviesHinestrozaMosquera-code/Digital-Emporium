// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Analytics can be added later if needed

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1crLmQlkC0iflC4_AXdErat0UP3UsRxs",
  authDomain: "digital-emporium-48495.firebaseapp.com",
  // Ensuring the databaseURL provided by the user is explicitly set
  databaseURL: "https://digital-emporium-48495-default-rtdb.firebaseio.com/", 
  projectId: "digital-emporium-48495",
  // Using the storageBucket value as provided by the user in a previous snippet
  storageBucket: "digital-emporium-48495.firebasestorage.app", 
  messagingSenderId: "362093800760",
  appId: "1:362093800760:web:31b14864efe28c2b43e5cd",
  measurementId: "G-6GPTJ0813F"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth only on the client-side
let auth: Auth | undefined;
if (typeof window !== 'undefined') {
  auth = getAuth(app);
}

const db: Database = getDatabase(app);

// Example for client-side Analytics initialization (if you uncomment the import)
// if (typeof window !== 'undefined') {
//   if (app.name && typeof window !== "undefined") {
//     analytics = getAnalytics(app);
//   }
// }

export { app, auth, db }; // Removed analytics from export for now
