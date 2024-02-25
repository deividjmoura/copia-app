// firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "Sua API Key",
  authDomain: "dash-vendas-54ab3.firebaseapp.com",
  databaseURL: "https://dash-vendas-54ab3-default-rtdb.firebaseio.com",
  projectId: "dash-vendas-54ab3",
  storageBucket: "dash-vendas-54ab3.appspot.com",
  messagingSenderId: "527332699500",
  appId: "1:527332699500:web:301ccdd03fae600cbe5749"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
