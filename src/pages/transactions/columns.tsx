import { ColumnDef } from "@tanstack/react-table"
import { Minus, Plus } from "lucide-react"
import { TransactionsForm } from "~/components/transactions-form"
import { Transaction } from "~/schemas/transaction"
import { formatPriceInReais } from "~/utils"

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => row.original.category?.title ?? ''
  },
  {
    accessorKey: "movement",
    header: "Movimentação",

    cell: ({ row }) => {
      const movementIcon = row.original.movement === "outgoing" ? <Minus className="text-[#8c78ba]" /> : <Plus className="text-[#8c78ba]" />

      return (
        <div className="ml-8">
          {movementIcon}
        </div>
      )

    }
  },
  {
    accessorKey: "valueInCents",
    header: "Valor",
    cell: ({ row }) => formatPriceInReais(row.original.valueInCents)
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const transaction = row.original
      return <TransactionsForm transaction={transaction} />
    },
  },
]
