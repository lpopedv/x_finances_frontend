import { ColumnDef } from "@tanstack/react-table"
import { Category } from "~/schemas/category"

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: 'actions',
    header: 'Ações'
  },
]
