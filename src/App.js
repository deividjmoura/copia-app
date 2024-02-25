import React, { useState, useEffect } from 'react';
import './App.css';
import { ChakraProvider, VStack, Heading, Button } from '@chakra-ui/react';
import SignUpForm from './components/SignUpform';
import LoginForm from './components/LoginForm';
import SalesComponent from './components/SalesComponent';
import SalesModal from './components/SalesModal'; // Importação do componente SalesModal
import firebase from 'firebase/compat/app';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      setIsLoggedIn(false);
      window.location.reload(); // Recarregar a página após o logout
    }).catch((error) => {
      console.error('Erro ao fazer logout:', error);
    });
  };
  

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  return (
    <ChakraProvider>
      <div className="background-container">
        <div className="content-container">
          <Heading as="h1" size="2xl" mb={8} color="white">Dashboard de Vendas</Heading>
          <VStack spacing={8} align="center">
            {isLoggedIn ? (
              <SalesComponent />
            ) : (
              <>
                <div className="button-container">
                  <SignUpForm />
                  <LoginForm onLogin={() => setIsLoggedIn(true)} />
                </div>
              </>
            )}
          </VStack>
        </div>
        <div className="logout-container"> {/* Div para posicionar o botão de logout ao lado do modal */}
          {isLoggedIn && (
            <>
              <Button onClick={handleOpenModal} colorScheme="blue">Abrir Modal</Button> {/* Botão para abrir o modal */}
              <button onClick={() => handleLogout()} className="logout-button">Logout</button>
            </>
          )}
        </div>
      </div>
      <SalesModal isOpen={isModalOpen} onClose={handleCloseModal} /> {/* Renderização do modal */}
    </ChakraProvider>
  );
};

export default App;
