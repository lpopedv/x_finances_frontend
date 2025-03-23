import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Category, categoryZodSchema } from "../schemas/category";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryRequests } from "~/requests/categories-request";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

interface CategoriesFormProps {
  category?: Category
}

export const CategoriesForm = ({ category }: CategoriesFormProps) => {
  const form = useForm<Category>({
    resolver: zodResolver(categoryZodSchema),
    defaultValues: {
      id: category?.id,
      title: category?.title ?? '',
      description: category?.description ?? ''
    }
  });

  const queryClient = useQueryClient()

  const createCategoryMutation = useMutation({
    mutationFn: CategoryRequests.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listCategories"] })
    }
  })

  const updateCategoryMutation = useMutation({
    mutationFn: CategoryRequests.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listCategories"] })
    }
  })

  const handleFormSubmit = (category: Category) => {
    if (category.id !== undefined) {
      updateCategoryMutation.mutate(category);
    } else {
      createCategoryMutation.mutate(category);
    }
  };

  const editingMode = category?.id !== undefined

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} className={editingMode ? 'cursor-pointer' : 'bg-[#584380] text-white hover:bg-[#8c78ba] cursor-pointer'} >{editingMode ? <Pencil className="text-[#8c78ba]" /> : 'Criar'}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editingMode ? `Editando: ${category.title}` : 'Crie uma categoria'}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-center w-full p-4 rounded-4xl gap-4">
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

            <Button type="submit" className="bg-[#584380] text-white hover:bg-[#8c78ba] cursor-pointer" >
              {category ? 'Salvar alterações' : 'Criar categoria'}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet >
  );
};
