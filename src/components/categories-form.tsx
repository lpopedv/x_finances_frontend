import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Category, categoryZodSchema } from "../schemas/category";
import { useEffect } from "react";

interface CategoriesFormProps {
  category: Category | null;
  onSubmit: (category: Category) => void;
}

export const CategoriesForm = ({ category, onSubmit }: CategoriesFormProps) => {
  const { register, handleSubmit, setValue } = useForm<Category>({
    resolver: zodResolver(categoryZodSchema)
  });

  useEffect(() => {
    if (category) {
      setValue("title", category.title);
      setValue("description", category.description);
    }
  }, [category, setValue]);

  const handleSubmitForm = (data: Category) => {
    if (category) {
      onSubmit({ ...data, id: category.id });
    } else {
      onSubmit(data);
    }

    setValue('title', '');
    setValue('description', '');
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <label htmlFor="title">Título</label>
      <input type="text" id="title" {...register('title')} />

      <label htmlFor="description">Descrição</label>
      <input type="text" id="description" {...register('description')} />

      <button type="submit">{category ? 'Salvar alterações' : 'Criar categoria'}</button>
    </form>
  );
};
