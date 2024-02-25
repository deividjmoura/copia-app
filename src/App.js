import React from 'react';
import './App.css'; // Importe o arquivo App.css
import { ChakraProvider, VStack, Heading } from '@chakra-ui/react';
import SignUpForm from './components/SignUpform'; // Importe o componente SignUpForm
import LoginForm from './components/LoginForm'; // Importe o componente LoginForm

function App() {
  React.useEffect(() => {
    console.log("Página carregada com sucesso!");
  }, []);

  return (
    <ChakraProvider>
    <div className="background-container">
      <div className="content-container">
        <Heading as="h1" size="2xl" mb={8} color="white">Dashboard de Vendas</Heading>
        <VStack spacing={8} align="flex-start">
          <SignUpForm />
          <LoginForm />
        </VStack>
      </div>
    </div>
    </ChakraProvider>
  );
}

export default App;
