import { ColumnDef } from "@tanstack/react-table"
import { CategoriesForm } from "~/components/categories-form"
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
    header: 'Ações',
    cell: ({ row }) => {
      const category = row.original
      return <CategoriesForm category={category} />
    },
  },
]
