
import React, { useState, useEffect } from 'react';
import { ChakraProvider, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardVendas from './components/DashboardVendas';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "dash-vendas-54ab3.firebaseapp.com",
  databaseURL: "https://dash-vendas-54ab3-default-rtdb.firebaseio.com",
  projectId: "dash-vendas-54ab3",
  storageBucket: "dash-vendas-54ab3.appspot.com",
  messagingSenderId: "527332699500",
  appId: "1:527332699500:web:301ccdd03fae600cbe5749"
};

// Verificar se o Firebase ainda não foi inicializado
if (!initializeApp.apps.length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth(); // Sem parâmetros para obter a instância padrão do Firebase Auth
const database = getDatabase(); 
function App() {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUser({ ...currentUser, name: userData.name });
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
    }).catch((error) => {
      console.error('Erro ao fazer logout:', error);
    });
  };

  const handleSignup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await set(ref(database, `users/${userCredential.user.uid}`), {
        name: name,
        email: email
      });
      setUser(userCredential.user);
      toast.success('Cadastro realizado com sucesso!');
      setShowSignupModal(false); // Fechar o modal de cadastro
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao realizar cadastro.');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast.success('Login realizado com sucesso!');
      setShowLoginModal(false); // Fechar o modal de login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao realizar login.');
    }
  };

  return (
    <ChakraProvider>
      <div className="App">
        <ToastContainer />
        {!user && (
          <>
            <Button onClick={() => setShowLoginModal(true)}>Login</Button>
            <Button onClick={() => setShowSignupModal(true)}>Cadastre-se</Button>
          </>
        )}
        {user && (
          <DashboardVendas user={user} handleLogout={handleLogout} />
        )}
        <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Login</ModalHeader>
            <ModalBody>
              <Login handleLogin={handleLogin} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setShowLoginModal(false)}>Fechar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cadastre-se</ModalHeader>
            <ModalBody>
              <Signup handleSignup={handleSignup} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setShowSignupModal(false)}>Fechar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </ChakraProvider>
  );
}

export default App;
