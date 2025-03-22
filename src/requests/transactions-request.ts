import { env } from "~/env";
import { Transaction } from "~/schemas/transaction";

const getAllTransactionsData = async () => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/transactions`);
  const responseJson = await response.json();
  return responseJson.transactions
};

const createTransaction = async (transaction: Transaction) => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  return await response.json();
};

const updateTransaction = async (transaction: Transaction) => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/transactions/${transaction.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  return await response.json();
};

export const TransactionRequests = {
  getAllTransactionsData,
  createTransaction,
  updateTransaction
}
