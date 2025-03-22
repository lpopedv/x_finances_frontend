import { useQuery } from "@tanstack/react-query";
import { TransactionsForm } from "~/components/transactions-form";
import { Card } from "~/components/ui/card";
import { TransactionsDataTable } from "./data-table";
import { transactionsColumns } from "./columns";
import { Loader2 } from "lucide-react";
import { TransactionRequests } from "~/requests/transactions-request";

export const Transactions = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["listTransactions"],
    queryFn: TransactionRequests.getAllTransactionsData,
  });

  const allTransactions = transactions ?? []

  return (
    <div className="flex flex-col items-end gap-6">
      <TransactionsForm />

      <Card className="p-4 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Carregando...</span>
          </div>
        ) : allTransactions?.length > 0 ? (
          <TransactionsDataTable columns={transactionsColumns} data={transactions ?? []} />
        ) : (
          <p className="text-center text-gray-500">Nenhuma transação encontrada.</p>
        )}
      </Card>
    </div>
  );
};


