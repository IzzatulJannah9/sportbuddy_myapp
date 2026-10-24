import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeZ9qZaPw_U9gB4d3flIUpCc92kiWF7Ag",
  authDomain: "sportbuddy-dd084.firebaseapp.com",
  projectId: "sportbuddy-dd084",
  storageBucket: "sportbuddy-dd084.firebasestorage.app",
  messagingSenderId: "890029285940",
  appId: "1:890029285940:web:d6106d8a5da872b1e1e061",
  measurementId: "G-4K3LX3CGF0"
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);