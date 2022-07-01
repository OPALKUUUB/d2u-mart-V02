import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDryMPtjnHKtvEjlZH6PATMjGHVuifYSOM",
  authDomain: "scraping-63305.firebaseapp.com",
  projectId: "scraping-63305",
  storageBucket: "scraping-63305.appspot.com",
  messagingSenderId: "148721585978",
  appId: "1:148721585978:web:e19751295d14819d978a03",
};
firebase.initializeApp(firebaseConfig);

const Firebase = firebase;
export default Firebase;