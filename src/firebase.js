// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvxznLHYM1tmYXfMG-YklWOObyPSdM7dw",
  authDomain: "realtor-homely.firebaseapp.com",
  projectId: "realtor-homely",
  storageBucket: "realtor-homely.appspot.com",
  messagingSenderId: "1035696135752",
  appId: "1:1035696135752:web:4cf4b4523264a6399fc27d",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore(); // for database storage
