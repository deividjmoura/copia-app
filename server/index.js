const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const app = express();

// Cria um pool de conexões com o banco de dados MySQL com no máximo 10 conexões simultâneas
const pool = mysql.createPool({
  host: '192.168.10.1',
  user: 'deivid_moura',
  password: 'De@729249',
  database: 'db_copia',
  connectionLimit: 100000
});

// Define onde os arquivos enviados serão armazenados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Cria um objeto Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limite de tamanho do arquivo
  }
});

// Rota para fazer o upload de arquivos
app.post('/upload', upload.single('file'), async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const cpf = req.body.cpf;
  const arquivo = req.file.filename;
  const tamanho = req.file.size;
  const tipo = req.file.mimetype;

  try {
    // Obtém uma conexão do pool de conexões
    const connection = await pool.getConnection();

    // Insere um novo usuário no banco de dados
    const sql1 = 'INSERT INTO usuarios (nome, email, cpf) VALUES (?, ?, ?)';
    await connection.query(sql1, [nome, email, cpf]);

    // Insere um novo arquivo no banco de dados
    const sql2 = 'INSERT INTO arquivos (nome, tamanho, tipo) VALUES (?, ?, ?)';
    await connection.query(sql2, [arquivo, tamanho, tipo]);

    // Libera a conexão de volta para o pool de conexões
    connection.release();

    res.send('Arquivo enviado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno do servidor');
  }
});

// Inicia o servidor na porta 1233  
app.listen(1233, () => {
  console.log('Servidor iniciado na porta 1233');
});
