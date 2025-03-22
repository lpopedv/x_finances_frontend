import { env } from "~/env";
import { Category } from "~/schemas/category";

const getAllCategoriesData = async () => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/categories`);

  const responseJson = await response.json()
  return responseJson.categories
};

const getCategories = async () => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/categories`);
  return await response.json();
};

const createCategory = async (category: Category) => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });
  return await response.json();
};

const updateCategory = async (category: Category) => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/categories/${category.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });
  return await response.json();
};

export const CategoryRequests = {
  getAllCategoriesData,
  getCategories,
  createCategory,
  updateCategory
}
