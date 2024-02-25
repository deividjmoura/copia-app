// Login.jsx

import React, { useState } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';

function Login({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password); // Chama a função handleLogin passando email e senha
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <Box>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <Input type="email" placeholder="E-mail" value={email} onChange={handleEmailChange} required />
        <Input type="password" placeholder="Senha" value={password} onChange={handlePasswordChange} required />
        <Button type="submit">Entrar</Button>
      </form>
    </Box>
  );
}

export default Login;
