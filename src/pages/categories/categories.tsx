import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { CategoriesForm } from "~/components/categories-form";
import { Card } from "~/components/ui/card";

import { Category } from "~/schemas/category";
import { CategoryDataTable } from "./data-table";
import { categoriesColumns } from "./columns";
import { CategoryRequests } from "~/requests/categories-request";

export const Categories = () => {
  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['listCategories'],
    queryFn: CategoryRequests.getAllCategoriesData
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const createCategoryMutation = useMutation({
    mutationFn: CategoryRequests.createCategory,
    onSuccess: () => {
      refetch();
      setEditingCategory(null);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: CategoryRequests.updateCategory,
    onSuccess: () => {
      refetch();
      setEditingCategory(null);
    }
  });

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


