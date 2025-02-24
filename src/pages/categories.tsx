import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { CategoriesForm } from "../components/categories-form";
import { Category } from "../schemas/category";
import { useState } from "react";

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
    <div>
      <CategoriesForm
        category={editingCategory}
        onSubmit={handleFormSubmit}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category: Category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.title}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEdit(category)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
