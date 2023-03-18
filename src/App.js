import './App.css';
import React from "react";
import UploadForm from "./components/UploadForm";
import logoImage from "./imgs/LOGO-COPIA-E-CIA-1024x1008.png";
import rightImg from "./imgs/93-zjzv5aec44wxy3as.webp";
import DetectUSB from './components/DetecUSB';

function App() {
  return (
    <div>
      <DetectUSB />
      <img src={logoImage} alt="Logo" className="logo" />
      <h2>Há 36 anos no mercado trazendo <br/>qualidade e satisfação.</h2>
      <img src={rightImg} alt="right" className="right-image" />
      <UploadForm />
      
    </div>
  );
}

export default App;
