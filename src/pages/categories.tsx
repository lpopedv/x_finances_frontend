import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { CategoriesForm } from "~/components/categories-form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Category } from "~/schemas/category";

export const Categories = () => {
  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['listCategories'],
    queryFn: getCategories
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      refetch();
      setEditingCategory(null);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      refetch();
      setEditingCategory(null);
    }
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleFormSubmit = (category: Category) => {
    if (category.id) {
      updateCategoryMutation.mutate(category);
    } else {
      createCategoryMutation.mutate(category);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-6">
      <CategoriesForm
        category={editingCategory}
        onSubmit={handleFormSubmit}
      />

      <Table>
        <TableCaption>Categorias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.title}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <button onClick={() => handleEdit(category)}>Editar</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const getCategories = async () => {
  const response = await fetch('http://localhost:3333/categories');
  return await response.json();
};

const createCategory = async (category: Category) => {
  const response = await fetch('http://localhost:3333/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });
  return await response.json();
};

const updateCategory = async (category: Category) => {
  const response = await fetch(`http://localhost:3333/categories/${category.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });
  return await response.json();
};
