import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input } from "@chakra-ui/react";
import { Bar } from 'react-chartjs-2';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const SalesModal = ({ isOpen, onClose }) => {
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);
  
  const fetchSalesData = () => {
    const salesRef = firebase.database().ref('sales');
    salesRef.once('value', (snapshot) => {
      const salesDataFromDatabase = snapshot.val();
      if (salesDataFromDatabase) { // Verifica se os dados não são null ou undefined
        const allSales = Object.values(salesDataFromDatabase);
        const salesArray = allSales.flatMap(userSales => Object.values(userSales));
        setSalesData(salesArray);
      } else {
        setSalesData([]);
      }
    });
  };

  const handleGoalChange = (event) => {
    const newGoal = parseFloat(event.target.value);
    const newSalesData = salesData.map(sale => ({
      ...sale,
      adjustedValue: sale.value - newGoal,
    }));
    setMonthlyGoal(newGoal);
    setSalesData(newSalesData);
  };

  const chartData = {
    labels: salesData.map(sale => sale.salesperson), // Array com os nomes dos vendedores
    datasets: [
      {
        label: 'Vendas por Vendedor',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: salesData.map(sale => sale.value), // Array com os valores das vendas
      },
      {
        label: 'Meta Mensal',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: Array(salesData.length).fill(monthlyGoal), // Array com o valor da meta mensal para cada vendedor
      },
    ],
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dados de Todos os Usuários</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Bar data={chartData} />
          <Input type="number" placeholder="Meta Mensal" value={monthlyGoal} onChange={handleGoalChange} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SalesModal;
