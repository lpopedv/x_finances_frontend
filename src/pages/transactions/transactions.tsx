
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { TransactionsForm } from "~/components/transactions-form";
import { Transaction } from "~/schemas/transaction";
import { Card } from "~/components/ui/card";
import { TransactionsDataTable } from "./data-table";
import { transactionsColumns } from "./columns";

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

  console.log(transactions)

  return (
    <div className="flex flex-col gap-6">
      <TransactionsForm
        transaction={editingTransaction}
        onSubmit={handleFormSubmit}
      />

      <Card className="p-4">
        <TransactionsDataTable columns={transactionsColumns} data={transactions} />
      </Card>
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

