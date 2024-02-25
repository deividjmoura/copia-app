
import firebase from 'firebase/compat/app'; // Importe o módulo padrão do Firebase
import 'firebase/compat/auth'; // Importe as funcionalidades de autenticação
import 'firebase/compat/database'; // Importe as funcionalidades do Firebase Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBSwuiGMLQl7FjKE8TM68u4fEjQM-p0uV0",
  authDomain: "dash-vendas-54ab3.firebaseapp.com",
  databaseURL: "https://dash-vendas-54ab3-default-rtdb.firebaseio.com",
  projectId: "dash-vendas-54ab3",
  storageBucket: "dash-vendas-54ab3.appspot.com",
  messagingSenderId: "527332699500",
  appId: "1:527332699500:web:301ccdd03fae600cbe5749"
};

// Inicialize o Firebase se ainda não estiver inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exporte o objeto de autenticação
export const auth = firebase.auth();
export const database = firebase.database();