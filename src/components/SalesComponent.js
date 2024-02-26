import React, { useState, useEffect } from "react";
import { Flex, Box, Input, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import firebase from 'firebase/compat/app';
import "firebase/database";
import "firebase/auth";
import { format } from 'date-fns';
import SalesModal from './SalesModal';

const SalesComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sales, setSales] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [value, setValue] = useState("");
  const [pvCmd, setPvCmd] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    firebase.database().ref(`sales/${userId}`).on('value', (snapshot) => {
      const salesData = snapshot.val();
      if (salesData) {
        const salesList = Object.entries(salesData).map(([saleId, sale]) => ({
          id: saleId,
          ...sale,
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
        pvCmd: parseFloat(pvCmd),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        vendedor: currentUser.uid,
      }).then(() => {
        console.log("Venda adicionada com sucesso!");
        setCompanyName("");
        setValue("");
        setPvCmd("");
        setIsDrawerOpen(false);
      }).catch((error) => {
        console.error("Erro ao adicionar venda:", error);
      });
    }
  };

  const handleDeleteSale = (saleId) => {
    if (currentUser) {
      firebase.database().ref(`sales/${currentUser.uid}/${saleId}`).remove()
        .then(() => {
          console.log("Venda excluída com sucesso!");
        }).catch((error) => {
          console.error("Erro ao excluir venda:", error);
        });
    }
  };

  const handleEditSale = (saleId) => {
    const novoValor = prompt("Digite o novo valor para a venda:");
    if (novoValor !== null && novoValor.trim() !== "") {
      firebase.database().ref(`sales/${currentUser.uid}/${saleId}`).update({
        value: parseFloat(novoValor),
      }).then(() => {
        console.log("Venda atualizada com sucesso!");
      }).catch((error) => {
        console.error("Erro ao atualizar venda:", error);
      });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Flex direction="column" align="center">
      {currentUser ? (
        <>
          <Box mb={4} mt={10} textAlign="center">
            <Button onClick={handleOpenDrawer}>Adicionar Venda</Button>
            <Button onClick={handleOpenModal} className="graph-button">Gráfico</Button>
          </Box>
          <Table>
            <Thead>
              <Tr>
                <Th>Empresa</Th>
                <Th>Valor (R$)</Th>
                <Th>CMD/PV</Th>
                <Th>Data</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sales.map((sale) => (
                <Tr key={sale.id}>
                  <Td>{sale.companyName}</Td>
                  <Td>R$ {sale.value}</Td>
                  <Td>{sale.pvCmd}</Td>
                  <Td>{format(new Date(sale.timestamp), "dd/MM/yyyy HH:mm")}</Td>
                  <Td>
                    <IconButton onClick={() => handleEditSale(sale.id)} aria-label="Editar venda">
                      <EditIcon />
                    </IconButton>
                    <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteSale(sale.id)} colorScheme="red" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Drawer placement="right" onClose={handleCloseDrawer} isOpen={isDrawerOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader>Cadastro de Venda</DrawerHeader>
              <DrawerBody>
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
                <Input
                  placeholder="CMD/PV"
                  value={pvCmd}
                  onChange={(e) => setPvCmd(e.target.value)}
                />
                <Button onClick={handleAddSale}>Adicionar</Button>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <LoginForm />
      )}

      <SalesModal isOpen={isModalOpen} onClose={handleCloseModal} />
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
