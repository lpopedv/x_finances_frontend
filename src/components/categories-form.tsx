import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Category, categoryZodSchema } from "../schemas/category";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { Card } from "./ui/card";

interface CategoriesFormProps {
  category: Category | null;
  onSubmit: (category: Category) => void;
}

export const CategoriesForm = ({ category, onSubmit }: CategoriesFormProps) => {
  const form = useForm<Category>({
    resolver: zodResolver(categoryZodSchema),
    defaultValues: {
      title: category?.title ?? '',
      description: category?.description ?? ''
    }
  });

  useEffect(() => {
    form.reset({
      title: category?.title ?? "",
      description: category?.description ?? "",
    });
  }, [category, form]);

  const handleSubmitForm = (data: Category) => {
    if (category) {
      onSubmit({ ...data, id: category.id });
    } else {
      onSubmit(data);
    }
  };

  return (

    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="flex items-center w-full p-4 rounded-4xl gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Título: <span className="text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Gastos Fixos" {...field} />
                </FormControl>
                <FormDescription>Crie um título para sua categoria</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Vinculada a transações recorrentes" {...field} />
                </FormControl>
                <FormDescription>Uma descrição clara para a nova categoria (opcional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" >
            {category ? 'Salvar alterações' : 'Criar categoria'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
