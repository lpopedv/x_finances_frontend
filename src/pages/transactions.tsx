
import { useQuery, useMutation } from "@tanstack/react-query";
import { FilePen, Loader } from "lucide-react";
import { useState } from "react";
import { TransactionsForm } from "~/components/transactions-form";
import { Transaction } from "~/schemas/transaction";
import { formatPriceInReais } from "~/utils";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export const Transactions = () => {
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["listTransactions"],
    queryFn: getTransactions,
  });

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      refetch();
      setEditingTransaction(null);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      refetch();
      setEditingTransaction(null);
    },
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
    <div className="flex flex-col gap-6">
      <TransactionsForm
        transaction={editingTransaction}
        onSubmit={handleFormSubmit}
      />

      <Table>
        <TableCaption>Transações</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Movimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Fixa</TableHead>
            <TableHead>Paga</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction: Transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.category?.title}</TableCell>
              <TableCell>{transaction.title}</TableCell>
              <TableCell>{transaction.movement}</TableCell>
              <TableCell>
                {formatPriceInReais(transaction.valueInCents)}
              </TableCell>
              <TableCell>
                {transaction.date
                  ? new Date(transaction.date).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>{transaction.isFixed ? "Sim" : "Não"}</TableCell>
              <TableCell>{transaction.isPaid ? "Sim" : "Não"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(transaction)}
                  className="cursor-pointer"
                >
                  <FilePen />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const getTransactions = async () => {
  const response = await fetch("http://localhost:3333/transactions");
  return await response.json();
};

const createTransaction = async (transaction: Transaction) => {
  const response = await fetch("http://localhost:3333/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  return await response.json();
};

const updateTransaction = async (transaction: Transaction) => {
  const response = await fetch(`http://localhost:3333/transactions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  return await response.json();
};

