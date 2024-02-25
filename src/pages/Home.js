import React from 'react';
import useAuth from '../components/useAuth';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {currentUser ? (
        <p>Bem-vindo, {currentUser.email}!</p>
      ) : (
        <p>Você não está logado.</p>
      )}
    </div>
  );
};

export default Home;
