import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { TransactionsForm } from "../components/transactions-form";
import { Transaction } from "../schemas/transaction";

export const Transactions = () => {

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['listTransactions'],
    queryFn: getTransactions
  });

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      refetch();
      setEditingTransaction(null);
    }
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      refetch();
      setEditingTransaction(null);
    }
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleFormSubmit = (transaction: Transaction) => {
    if (transaction.id) {
      updateTransactionMutation.mutate(transaction);
    } else {
      createTransactionMutation.mutate(transaction);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <TransactionsForm
        transaction={editingTransaction}
        onSubmit={handleFormSubmit}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoria</th>
            <th>Título</th>
            <th>Movimento</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Fixa</th>
            <th>Paga</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction: Transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.category?.title}</td>
              <td>{transaction.title}</td>
              <td>{transaction.movement}</td>
              <td>{transaction.valueInCents}</td>
              <td>{}</td>
              <td>{transaction.isFixed ? 'Sim' : 'Não'}</td>
              <td>{transaction.isPaid ? 'Sim' : 'Não'}</td>
              <td>
                <button onClick={() => handleEdit(transaction)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const getTransactions = async () => {
  const response = await fetch('http://localhost:3333/transactions');
  const data = await response.json();
  return data;
}

const createTransaction = async (transaction: Transaction) => {
  const response = await fetch('http://localhost:3333/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });

  return await response.json();
}

const updateTransaction = async (transaction: Transaction) => {
  const response = await fetch(`http://localhost:3333/transactions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });

  return await response.json();
}

