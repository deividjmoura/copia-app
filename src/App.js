import React, { useState, useEffect } from 'react';
import './App.css';
import { ChakraProvider, VStack, Heading } from '@chakra-ui/react';
import SignUpForm from './components/SignUpform';
import LoginForm from './components/LoginForm';
import SalesComponent from './components/SalesComponent';
import firebase from 'firebase/compat/app';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      setIsLoggedIn(false);
      window.location.reload(); // Recarregar a página após o logout
    }).catch((error) => {
      console.error('Erro ao fazer logout:', error);
    });
  };

  useEffect(() => {
    console.log("Página carregada com sucesso!");
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
        <div className="logout-container">
          {isLoggedIn && (
            <>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          )}
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
