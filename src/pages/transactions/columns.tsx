import { ColumnDef } from "@tanstack/react-table"
import { Minus, Plus } from "lucide-react"
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

    cell: ({ row }) => row.original.movement === "outgoing" ? <Minus className="text-[#8c78ba]" /> : <Plus className="text-[#8c78ba]" />
  },
  {
    accessorKey: "valueInCents",
    header: "Valor",
    cell: ({ row }) => formatPriceInReais(row.original.valueInCents)
  },
  {
    accessorKey: 'actions',
    header: 'Ações'
  },
]
