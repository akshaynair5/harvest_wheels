import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhBYMGGecvu9tsN-M4ytRodhs-Ns6ZCQo",
    authDomain: "harvest-wheels.firebaseapp.com",
    projectId: "harvest-wheels",
    storageBucket: "harvest-wheels.appspot.com",
    messagingSenderId: "1027798188597",
    appId: "1:1027798188597:web:9af123e93f9a0cf89d677c",
    measurementId: "G-JS28Q0E4Z8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth =getAuth()
export const storage = getStorage()
export const db = getFirestore(app);