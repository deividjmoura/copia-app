import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { auth } from '../components/firebaseConfig'; // Importe o objeto de autenticação do Firebase

const DashHome = () => {
  // Obtenha o nome do usuário atual
  const currentUser = auth.currentUser;
  const userName = currentUser ? currentUser.displayName : 'Usuário';

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={4}>
        Bem-vindo, {userName}!
      </Heading>
      {/* Aqui você pode adicionar o conteúdo da sua página DashHome */}
    </Box>
  );
};

export default DashHome;
