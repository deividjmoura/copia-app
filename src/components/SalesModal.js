import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import firebase from 'firebase/compat/app';

const SalesModal = ({ isOpen, onClose }) => {
  const [metaMensal, setMetaMensal] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const userIdDeivid = 'mfIyuB4gPOfvmf0ivaWOFXOPbqn2';

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        if (user.uid === userIdDeivid) {
          fetchMetaMensal();
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMetaMensal = () => {
    firebase.database().ref('metaMensal').once('value')
      .then(snapshot => {
        const meta = snapshot.val();
        setMetaMensal(meta);
      })
      .catch(error => {
        console.error('Erro ao buscar meta mensal:', error);
      });
  };

  const handleUpdateMetaMensal = () => {
    if (currentUser && currentUser.uid === userIdDeivid) {
      firebase.database().ref('metaMensal').set(metaMensal)
        .then(() => {
          console.log('Meta mensal atualizada com sucesso!');
          onClose();
          // Adiciona um toast informativo para o usuário Deivid
          // Adicione aqui o código para exibir o toast
        })
        .catch(error => {
          console.error('Erro ao atualizar meta mensal:', error);
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Atualizar Meta Mensal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {currentUser && currentUser.uid === userIdDeivid ? (
            <FormControl>
              <FormLabel>Meta Mensal (R$)</FormLabel>
              <Input type="number" value={metaMensal} onChange={(e) => setMetaMensal(e.target.value)} />
            </FormControl>
          ) : (
            <Text>Meta Mensal: {metaMensal}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          {currentUser && currentUser.uid === userIdDeivid && (
            <Button colorScheme="blue" mr={3} onClick={handleUpdateMetaMensal}>
              Atualizar
            </Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SalesModal;
