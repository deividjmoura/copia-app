// SignUpForm.js
import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { auth, database } from './firebaseConfig'; // Importe o objeto de autenticação e database do Firebase
import { v4 as uuidv4 } from 'uuid'; // Importe a função uuidv4 para gerar uma ID única
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    try {
      // Cria o usuário com e-mail e senha
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      // Gera uma ID única para o novo usuário
      const userId = uuidv4();

      // Salva o nome do usuário no Realtime Database com a ID única gerada
      await database.ref('users/' + userId).set({
        name: name
      });

      toast.success('Usuário cadastrado com sucesso!');
      setIsOpen(false); // Fecha o modal após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.message);
      toast.error(`Erro ao cadastrar usuário: ${error.message}`);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Cadastrar</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastro de Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="name">
                <FormLabel>Nome</FormLabel>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
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
            <Button colorScheme="blue" mr={3} onClick={handleSignUp}>
              Cadastrar
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Container de toasts */}
      <ToastContainer />
    </>
  );
};

export default SignUpForm;
