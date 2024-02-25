import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Input } from '@chakra-ui/react';
import { ref, onValue, off, get, push, set, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBSwuiGMLQl7FjKE8TM68u4fEjQM-p0uV0",
  authDomain: "dash-vendas-54ab3.firebaseapp.com",
  databaseURL: "https://dash-vendas-54ab3-default-rtdb.firebaseio.com",
  projectId: "dash-vendas-54ab3",
  storageBucket: "dash-vendas-54ab3.appspot.com",
  messagingSenderId: "527332699500",
  appId: "1:527332699500:web:301ccdd03fae600cbe5749"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

async function setupDatabase() {
  try {
    // Configurações iniciais do banco de dados, se necessário
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
  }
}

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
    try {
      if (saleId) {
        console.log('Tentativa de exclusão de venda:', saleId);
        // Verificar se o usuário está autenticado
        if (!user || !user.uid) {
          console.error('Usuário não autenticado. Não é possível excluir a venda.');
          return;
        }
    
        // Verificar se o usuário está autorizado a excluir a venda
        const saleRef = ref(database, `users/${user.uid}/sales/${saleId}`); // Corrigido para usar a referência correta
        const saleSnapshot = await get(saleRef);
        const saleData = saleSnapshot.val();
    
        if (!saleData) {
          console.error('Venda não encontrada ou não autorizada para exclusão.');
          return;
        }
    
        if (saleData.userId !== user.uid) {
          console.error('Usuário não autorizado para excluir esta venda.');
          return;
        }
    
        // Remover a venda
        await remove(saleRef);
        console.log('Venda excluída com sucesso:', saleId);
    
        // Atualizar a lista de vendas após a exclusão
        setSalesList(prevSales => prevSales.filter(sale => sale.id !== saleId));
      }
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
    }
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
