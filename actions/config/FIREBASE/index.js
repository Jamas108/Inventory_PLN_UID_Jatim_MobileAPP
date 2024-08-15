import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage"; 

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAac5nZotkL4gC9PXiLNpMKdtocFa2fCpw",
  authDomain: "inventorypln-7c80e.firebaseapp.com",
  databaseURL: "https://inventorypln-7c80e-default-rtdb.firebaseio.com",
  projectId: "inventorypln-7c80e",
  storageBucket: "inventorypln-7c80e.appspot.com",
  messagingSenderId: "800805229429",
  appId: "1:800805229429:web:1e0dc6519c8bf8d214b93c",
  measurementId: "G-PSQJBR8J2M"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use that one
}

const FIREBASE = firebase;

export default FIREBASE;
