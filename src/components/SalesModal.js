import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import firebase from 'firebase/compat/app';

const SalesModal = ({ isOpen, onClose }) => {
  const [metaMensal, setMetaMensal] = useState(0);
  const [novoValorMeta, setNovoValorMeta] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const userIdDeivid = 'mfIyuB4gPOfvmf0ivaWOFXOPbqn2'; // ID do usuário com permissão de alterar a meta

  useEffect(() => {
    // Carregar a meta mensal do banco de dados
    firebase.database().ref('metaMensal').once('value')
      .then(snapshot => {
        const meta = snapshot.val();
        if (meta !== null) {
          setMetaMensal(meta);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar meta mensal:', error);
      });

    // Verificar se há um usuário autenticado
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Atualizar a meta mensal no banco de dados
  const handleUpdateMetaMensal = () => {
    firebase.database().ref('metaMensal').set(parseFloat(novoValorMeta))
      .then(() => {
        console.log('Meta mensal atualizada com sucesso!');
        setMetaMensal(parseFloat(novoValorMeta));
      })
      .catch(error => {
        console.error('Erro ao atualizar meta mensal:', error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Meta Mensal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>R$ {metaMensal}</Text>
          {currentUser && currentUser.uid === userIdDeivid && (
            <FormControl mt={4}>
              <FormLabel>Novo Valor da Meta Mensal (R$)</FormLabel>
              <Input type="number" value={novoValorMeta} onChange={(e) => setNovoValorMeta(e.target.value)} />
              <Button mt={4} colorScheme="blue" onClick={handleUpdateMetaMensal}>Salvar</Button>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SalesModal;
