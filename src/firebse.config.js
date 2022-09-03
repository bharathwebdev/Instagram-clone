// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3cxLRFNSUTSG5xE0dIe3Sp5jHEX5b6QA",
  authDomain: "instagram-clone-e4cd1.firebaseapp.com",
  projectId: "instagram-clone-e4cd1",
  storageBucket: "instagram-clone-e4cd1.appspot.com",
  messagingSenderId: "289403975317",
  appId: "1:289403975317:web:04d095253d886de2764d9c",
  measurementId: "G-NNW0GMV0Z6"
};

// Initialize Firebase

export  const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
const analytics = getAnalytics(app);
export const db  = getFirestore()
// const ref = collection(db,'posts');
// getDocs(ref)
// .then(snapshot=>{
//     let books=[];
//     snapshot.docs.forEach(doc=>{
//         books.push({...doc.data(),id:doc.id})
//     })
//     console.log(books);
// });
