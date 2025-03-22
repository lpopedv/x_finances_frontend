import { useQuery } from "@tanstack/react-query";
import { Loader, Loader2 } from "lucide-react";
import { CategoriesForm } from "~/components/categories-form";
import { Card } from "~/components/ui/card";

import { CategoryDataTable } from "./data-table";
import { categoriesColumns } from "./columns";
import { CategoryRequests } from "~/requests/categories-request";

export const Categories = () => {
  const { data: allCategories, isLoading } = useQuery({
    queryKey: ['listCategories'],
    queryFn: CategoryRequests.getAllCategoriesData
  });


  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col items-end gap-6">
      <CategoriesForm />

      <Card className="p-4 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Carregando...</span>
          </div>
        ) : allCategories?.length > 0 ? (
          <CategoryDataTable columns={categoriesColumns} data={allCategories} />
        ) : (
          <p className="text-center text-gray-500">Nenhuma categoria encontrada.</p>
        )}
      </Card>
    </div>
  );
};


