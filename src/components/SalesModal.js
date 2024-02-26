import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, Text, Flex, Box } from "@chakra-ui/react";
import firebase from 'firebase/compat/app';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesModal = ({ isOpen, onClose }) => {
  const [metaMensal, setMetaMensal] = useState(0);
  const [novoValorMeta, setNovoValorMeta] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchMetaMensal();
        fetchVendedoresData();
      } else {
        setCurrentUser(null);
      }
    });
    return () => {
      unsubscribe();
      firebase.database().ref('metaMensal').off('value');
    };
  }, []);

  const fetchMetaMensal = () => {
    firebase.database().ref('metaMensal').on('value', (snapshot) => {
      const meta = snapshot.val();
      if (meta !== null) {
        setMetaMensal(meta);
      }
    });
  };

  const fetchVendedoresData = () => {
    firebase.database().ref('sales').once('value').then((snapshotSales) => {
      const vendasPorVendedor = {};
  
      snapshotSales.forEach(childSnapshot => {
        const salesData = childSnapshot.val();
        Object.values(salesData).forEach(sale => {
          const vendedor = sale.vendedor;
          const valorVenda = sale.value;
  
          if (!vendasPorVendedor[vendedor]) {
            vendasPorVendedor[vendedor] = 0;
          }
  
          vendasPorVendedor[vendedor] += valorVenda;
        });
      });
  
      const vendedoresArray = Object.entries(vendasPorVendedor).map(([userId, vendas]) => ({
        userId: userId,
        vendas: vendas
      }));

      // Buscar nomes de usuários com base nas IDs dos vendedores
      Promise.all(vendedoresArray.map(vendedor => {
        return firebase.database().ref(`users/${vendedor.userId}/name`).once('value').then(snapshot => {
          return {
            ...vendedor,
            nome: snapshot.val()
          };
        });
      })).then(vendedoresComNome => {
        setVendedores(vendedoresComNome);
      }).catch(error => {
        console.error('Erro ao buscar nomes de usuários:', error);
      });
    }).catch(error => {
      console.error('Erro ao recuperar dados de vendas:', error);
    });
  };

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

  // Calcular o valor total de vendas de todos os vendedores
  const totalVendas = vendedores.reduce((total, vendedor) => total + vendedor.vendas, 0);
  // Calcular o valor que falta para atingir a meta mensal
  const faltaParaMeta = metaMensal - totalVendas;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="80%">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Meta Mensal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>R$ {metaMensal}</Text>
          <Text>Falta: R$ {faltaParaMeta}</Text>
          {/* Renderizando o gráfico de barras */}
          <Flex justify="center">
            <Box w="80%">
              <BarChart width={800} height={400} data={vendedores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#8884d8" />
              </BarChart>
            </Box>
          </Flex>
          {currentUser && (
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
