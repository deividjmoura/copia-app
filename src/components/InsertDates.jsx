import React, { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { Input, Button } from '@chakra-ui/react';

const InsertDates = ({ userId }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    // Convertendo o valor para um número
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      console.error('O valor inserido não é um número válido.');
      return;
    }

    const database = getDatabase();
    const userSalesRef = ref(database, `users/${userId}/sales`); // Referência para a localização das vendas do usuário
    
    // Criar uma nova entrada única com chave exclusiva usando push
    const newSaleRef = push(userSalesRef);

    // Obtendo a ID única gerada para a nova venda
    const saleId = newSaleRef.key;

    // Setando o valor no nó específico das vendas do usuário, juntamente com a ID da venda
    set(newSaleRef, { id: saleId, valor: numericValue })
      .then(() => {
        console.log('Valor inserido com sucesso no Realtime Database.');
        setValue(''); // Limpando o campo de entrada após o envio bem-sucedido
      })
      .catch((error) => {
        console.error('Erro ao inserir valor no Realtime Database:', error);
      });
  };

  return (
    <div>
      <Input
        placeholder="Digite o valor de suas vendas"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={handleSubmit}>Enviar</Button>
    </div>
  );
};

export default InsertDates;
