import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import firebase from 'firebase/compat/app';


const SalesModal = ({ isOpen, onClose }) => {
  const [metaMensal, setMetaMensal] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        // Verifica se o usuário tem permissão para atualizar a meta
        if (user.uid === 'be6bc8eb-c5cf-4711-98ce-cc9edc5a5f4c') {
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
    // Verifica se o usuário está autenticado e tem permissão
    if (currentUser && currentUser.uid === 'be6bc8eb-c5cf-4711-98ce-cc9edc5a5f4c') {
      firebase.database().ref('metaMensal').set(metaMensal)
        .then(() => {
          console.log('Meta mensal atualizada com sucesso!');
          onClose(); // Fecha o modal após a atualização
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
          <FormControl>
            <FormLabel>Meta Mensal (R$)</FormLabel>
            <Input type="number" value={metaMensal} onChange={(e) => setMetaMensal(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdateMetaMensal}>
            Atualizar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SalesModal;
