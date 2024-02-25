import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import firebase from 'firebase/compat/app';

const SalesModal = ({ isOpen, onClose }) => {
  const [metaMensal, setMetaMensal] = useState(0);
  const [novoValorMeta, setNovoValorMeta] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalVendas, setTotalVendas] = useState(0);

  const userIdDeivid = 'mfIyuB4gPOfvmf0ivaWOFXOPbqn2'; 

  useEffect(() => {
    const fetchMetaMensal = () => {
      firebase.database().ref('metaMensal').on('value', (snapshot) => {
        const meta = snapshot.val();
        if (meta !== null) {
          setMetaMensal(meta);
        }
      });
    };

    const fetchTotalVendas = () => {
      firebase.database().ref('sales').on('value', (snapshot) => {
        let total = 0;
        snapshot.forEach(childSnapshot => {
          const salesData = childSnapshot.val();
          Object.values(salesData).forEach(sale => {
            total += sale.value;
          });
        });
        setTotalVendas(total);
      });
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchMetaMensal();
        fetchTotalVendas();
      } else {
        setCurrentUser(null);
      }
    });
    return () => {
      unsubscribe();
      firebase.database().ref('metaMensal').off('value');
      firebase.database().ref('sales').off('value');
    };
  }, []);

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

  const faltaParaMeta = metaMensal - totalVendas;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Meta Mensal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>R$ {metaMensal}</Text>
          <Text>Falta: R$ {faltaParaMeta}</Text>
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
