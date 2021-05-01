import firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "AIzaSyD1zKidvA6QEoNmiEdlIlhydk457GjIuH8",
  authDomain: "todo-1f6f0.firebaseapp.com",
  projectId: "todo-1f6f0",
  storageBucket: "todo-1f6f0.appspot.com",
  messagingSenderId: "254208070675",
  appId: "1:254208070675:web:7f9ab9b22284c580519be6"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };
