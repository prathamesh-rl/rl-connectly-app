// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVf0HKb3omEdzoVCL8E4gmAybpy5erx8I",
  authDomain: "connectly-dashboard-rl.firebaseapp.com",
  projectId: "connectly-dashboard-rl",
  storageBucket: "connectly-dashboard-rl.appspot.com",
  messagingSenderId: "869227340543",
  appId: "1:869227340543:web:ac2776cd3b3bca5bc0e2ca",
  measurementId: "G-HBN0EF0FXH"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { app, auth };
