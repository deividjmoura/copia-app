import React, { useState, useEffect } from "react";
import { Flex, Box, Input, Button, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import firebase from 'firebase/compat/app';
import "firebase/database";
import "firebase/auth";
import { format } from 'date-fns';
import SalesModal from './SalesModal'; // Importação do componente SalesModal

const SalesComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sales, setSales] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [value, setValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchSalesData(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSalesData = (userId) => {
    firebase
      .database()
      .ref(`sales/${userId}`)
      .on("value", (snapshot) => {
        const salesData = snapshot.val();
        if (salesData) {
          const salesList = Object.keys(salesData).map((key) => ({
            id: key,
            ...salesData[key],
          }));
          setSales(salesList);
        } else {
          setSales([]);
        }
      });
  };

  const handleAddSale = () => {
    if (currentUser) {
      const newSaleRef = firebase.database().ref(`sales/${currentUser.uid}`).push();
      newSaleRef.set({
        companyName: companyName,
        value: parseFloat(value),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });
      setCompanyName("");
      setValue("");
    }
  };

  const handleDeleteSale = (saleId) => {
    if (currentUser) {
      firebase.database().ref(`sales/${currentUser.uid}/${saleId}`).remove();
    }
  };

  const handleEditSale = (saleId) => {
    const saleToEdit = sales.find((sale) => sale.id === saleId);
    if (!saleToEdit) {
      console.error(`Venda com ID ${saleId} não encontrada`);
      return;
    };
    // Implemente a lógica para editar a venda com o ID fornecido
    console.log(`Editar venda com ID: ${saleId}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Flex direction="column" align="center">
      {currentUser ? (
        <>
          <Box mb={4} mt={10} textAlign="center">
            <Input
              placeholder="Nome da Empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              placeholder="Valor (R$)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button onClick={handleAddSale}>Adicionar Venda</Button>
            <Button onClick={handleOpenModal} className="graph-button">Gráfico</Button> {/* Botão para abrir o modal */}
          </Box>
          <Table>
            <Tbody>
              {sales.map((sale) => (
                <Tr key={sale.id}>
                  <Td>{sale.companyName}</Td>
                  <Td>{sale.value}</Td>
                  <Td>{format(new Date(sale.timestamp), "dd/MM/yyyy HH:mm")}</Td>
                  <Td>
                    <Button onClick={() => handleEditSale(sale.id)}>Editar</Button>
                    <Button onClick={() => handleDeleteSale(sale.id)}>Excluir</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : (
        <LoginForm />
      )}

      <SalesModal isOpen={isModalOpen} onClose={handleCloseModal} /> {/* Renderização do modal */}
    </Flex>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password);
  };

  return (
    <Flex direction="column" align="center">
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
    </Flex>
  );
};

export default SalesComponent;
