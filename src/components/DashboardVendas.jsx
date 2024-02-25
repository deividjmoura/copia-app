// DashboardVendas.jsx
import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Input } from '@chakra-ui/react';
import { ref, onValue, off, push, set } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { deleteSale } from '../Utils'; // Importe a função deleteSale
import firebaseApp from "../firebaseConfig";

const database = getDatabase(firebaseApp);


const DashboardVendas = ({ user, handleLogout }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [userSales, setUserSales] = useState(0);
  const [newSaleValue, setNewSaleValue] = useState('');
  const [newSaleCompany, setNewSaleCompany] = useState('');
  const [salesList, setSalesList] = useState([]);
  const userSalesRef = user ? ref(database, `users/${user.uid}/sales`) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar a lista de vendas do usuário
        if (user && user.uid) {
          const userSalesListener = onValue(userSalesRef, (snapshot) => {
            const salesData = snapshot.val();
            if (salesData) {
              const total = Object.values(salesData).reduce((acc, cur) => acc + cur.valor, 0);
              setUserSales(total);
              setSalesList(Object.entries(salesData).map(([id, sale]) => ({ id, ...sale })));
            } else {
              setUserSales(0);
              setSalesList([]);
            }
          });
  
          // Retornar a função de remoção do listener para desmontar o componente
          return () => {
            if (userSalesListener) {
              off(userSalesRef, 'value', userSalesListener);
            }
          };
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchData();

    // Buscar a lista de todas as vendas para calcular o valor total de vendas de todos os usuários
    const allSalesRef = ref(database, 'sales');
    const allSalesListener = onValue(allSalesRef, (snapshot) => {
      let total = 0;
      const salesData = snapshot.val();
      if (salesData) {
        total = Object.values(salesData).reduce((acc, cur) => acc + cur.valor, 0);
      }
      setTotalSales(total);
    });

    return () => {
      if (allSalesListener) {
        off(allSalesRef, 'value', allSalesListener); // Corrigido para desvincular o listener corretamente
      }
    };
  }, [user]);

  const handleAddSale = async () => {
    try {
      if (user && user.uid && newSaleValue !== '' && newSaleCompany !== '') {
        const numericValue = parseFloat(newSaleValue);
        if (isNaN(numericValue)) {
          console.error('O valor inserido não é um número válido.');
          return;
        }
        
        const newSaleUserRef = push(userSalesRef);
        await set(newSaleUserRef, {
          company: newSaleCompany,
          valor: numericValue,
        });

        const newSaleTotalRef = push(ref(database, 'sales'));
        await set(newSaleTotalRef, {
          userId: user.uid,
          company: newSaleCompany,
          valor: numericValue,
        });

        setNewSaleValue('');
        setNewSaleCompany('');
      }
    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
    }
  };

  const handleDeleteSale = async (saleId) => {
    deleteSale(user, saleId, setSalesList); // Use a função deleteSale importada
  };

  return (
    <Box>
      <Text>Bem-vindo, {user ? user.displayName : 'Convidado'}!</Text>
      <Text>Total de suas vendas: R$ {userSales.toFixed(2)}</Text>
      <Text>Total de vendas de todos os usuários: R$ {totalSales.toFixed(2)}</Text>
      <Button onClick={handleLogout}>Logout</Button>
      
      {user && (
        <Box>
          <Input
            placeholder="Nome da empresa"
            value={newSaleCompany}
            onChange={(e) => setNewSaleCompany(e.target.value)}
          />
          <Input
            placeholder="Digite o valor da venda"
            value={newSaleValue}
            onChange={(e) => setNewSaleValue(e.target.value)}
          />
          <Button onClick={handleAddSale}>Adicionar Venda</Button>
        </Box>
      )}
      
      <Box>
        <Text>Lista de Suas Vendas:</Text>
        <ul>
          {salesList.map(sale => (
            <li key={sale.id}> {/* Usamos sale.id como chave única */}
              Empresa: {sale.company} - Valor: {sale.valor}
              <Button ml={2} size="sm" onClick={() => handleDeleteSale(sale.id)}>Excluir</Button>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default DashboardVendas;
