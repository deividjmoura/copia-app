// Utils.jsx
import { ref, remove, getDatabase } from 'firebase/database';
import firebaseApp from "./firebaseConfig";

const database = getDatabase(firebaseApp);


export const deleteSale = async (user, saleId, setSalesList) => {
  try {
    if (saleId) {
      console.log('Tentativa de exclusão de venda:', saleId);
      // Verificar se o usuário está autenticado
      if (!user || !user.uid) {
        console.error('Usuário não autenticado. Não é possível excluir a venda.');
        return;
      }

      // Verificar se o usuário está autorizado a excluir a venda
      const saleRef = ref(database, `users/${user.uid}/sales/${saleId}`);
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
