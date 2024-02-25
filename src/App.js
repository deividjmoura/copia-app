import React, { useState, useEffect } from 'react';
import './App.css';
import { ChakraProvider, VStack, Heading, Button } from '@chakra-ui/react';
import SignUpForm from './components/SignUpform';
import LoginForm from './components/LoginForm';
import SalesComponent from './components/SalesComponent';
import SalesModal from './components/SalesModal'; // Importação do componente SalesModal
import firebase from 'firebase/compat/app';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

  useEffect(() => {
    console.log("Página carregada com sucesso!");
    // Verificar se o usuário está autenticado
    // Aqui você pode usar o Firebase Auth para verificar a autenticação
    // e definir o estado de isLoggedIn conforme necessário
    // Exemplo:
    firebase.auth().onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout, por exemplo, usando Firebase Auth
    // firebase.auth().signOut();
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ChakraProvider>
      <div className="background-container">
        <div className="content-container">
          <Heading as="h1" size="2xl" mb={8} color="white">Dashboard de Vendas</Heading>
          <VStack spacing={8} align="center">
            {isLoggedIn ? <SalesComponent /> : null} {/* Renderiza SalesComponent apenas se o usuário estiver logado */}
            {!isLoggedIn && (
              <div className="button-container">
                <SignUpForm />
                <LoginForm onLogin={handleLogin} />
              </div>
            )}
          </VStack>
        </div>
        <div className="logout-container"> {/* Div para posicionar o botão de logout ao lado do modal */}
          {isLoggedIn && (
            <>
              <button onClick={handleLogout} className="logout-button">Logout</button>
              <Button onClick={handleOpenModal} colorScheme="blue">Abrir Modal</Button> {/* Botão para abrir o modal */}
            </>
          )}
        </div>
      </div>
      <SalesModal isOpen={isModalOpen} onClose={handleCloseModal} /> {/* Renderização do modal */}
    </ChakraProvider>
  );
}

export default App;
