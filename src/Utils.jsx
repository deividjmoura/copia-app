import { ref, remove } from 'firebase/database';

export const deleteSale = async (userId, saleId, userSalesRef, database) => {
  try {
    if (userId && saleId && userSalesRef) {
      // Referência para a venda específica do usuário
      const userSaleRef = ref(userSalesRef.child(saleId)); 
      
      // Referência para a venda no nó "sales"
      const totalSaleRef = ref(database, `sales/${saleId}`);
      
      // Remover a venda das vendas do usuário e do nó "sales"
      await Promise.all([remove(userSaleRef), remove(totalSaleRef)]);

      console.log(`Venda excluída com sucesso em todos os locais.`);
    } else {
      throw new Error('Parâmetros inválidos para excluir a venda.');
    }
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    throw error;
  }
};
