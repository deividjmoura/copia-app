const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().slice(0, 10);
    cb(null, `${file.originalname}-${date}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500000000 } // Limite de 500MB
});

app.post('/upload', upload.array('file'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

app.listen(4566, '192.168.1.10', () => {
  console.log('Servidor rodando na porta 4566');
});
