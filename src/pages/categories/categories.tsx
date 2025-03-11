import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { CategoriesForm } from "~/components/categories-form";
import { Card } from "~/components/ui/card";

import { Category } from "~/schemas/category";
import { CategoryDataTable } from "./data-table";
import { categoriesColumns } from "./columns";

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

      <Card className="p-4">
        <CategoryDataTable data={categories} columns={categoriesColumns} />
      </Card>
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
