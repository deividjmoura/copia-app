// LoginForm.js
import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from '@chakra-ui/react';
import { auth } from './firebaseConfig'; // Importe o objeto de autenticação do Firebase

const LoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast(); // Use o hook useToast para exibir toasts

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      toast({
        title: 'Login bem-sucedido!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.log('Usuário logado com sucesso!');
      setIsOpen(false); // Fecha o modal após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Login</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Senha</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleLogin}>
              Login
            </Button>
            <Button variant="solid" colorScheme="green" _hover={{ bg: "green.600" }} mx={2}onClick={() => setIsOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginForm;
