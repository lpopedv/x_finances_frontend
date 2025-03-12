import { useForm } from "react-hook-form";
import { format } from "date-fns"
import { Transaction, transactionZodSchema } from "../schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "../schemas/category";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Pencil } from "lucide-react";
import { cn } from "~/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Calendar } from "./ui/calendar";

interface TransactionsFormProps {
  transaction?: Transaction
}

export const TransactionsForm = ({ transaction }: TransactionsFormProps) => {
  const form = useForm<Transaction>({
    resolver: zodResolver(transactionZodSchema),
    defaultValues: {
      id: transaction?.id,
      categoryId: transaction?.categoryId ?? 0,
      title: transaction?.title ?? '',
      movement: transaction?.movement ?? 'outgoing',
      valueInCents: transaction?.valueInCents ?? 0,
      date: transaction?.date ?? new Date(),
      isFixed: transaction?.isFixed ?? false,
      isPaid: transaction?.isPaid ?? false,
    }
  });

  const { data: categoriesSelect } = useQuery({
    queryKey: ['categoriesSelect'],
    queryFn: getCategories
  });

  const queryClient = useQueryClient()

  useEffect(() => {
    if (categoriesSelect?.length > 0 && !transaction && form.getValues('categoryId') === 0) {
      form.setValue('categoryId', categoriesSelect[0].id);
    }
  }, [categoriesSelect, form, transaction]);

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTransactions"] })
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTransactions"] })
    },
  });

  const handleFormSubmit = (transaction: Transaction) => {


    if (transaction.id !== undefined) {
      console.log('updatada')
      updateTransactionMutation.mutate(transaction);
    } else {

      console.log('creada')
      createTransactionMutation.mutate(transaction);
    }
  };

  const editingMode = transaction?.id !== undefined

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} className={editingMode ? 'cursor-pointer' : 'bg-[#584380] text-white hover:bg-[#8c78ba] cursor-pointer'} >{editingMode ? <Pencil className="text-[#8c78ba]" /> : 'Criar'}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editingMode ? `Editando: ${transaction.title}` : 'Crie uma transação'}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-4 flex flex-col gap-6">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título: <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Título da transação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria: <span className="text-red-500">*</span> </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesSelect?.map((category: Category) => (
                        <SelectItem key={category.id} value={category?.id?.toString() as string}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="movement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movimento: <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o movimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Entrada</SelectItem>
                      <SelectItem value="outgoing">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valueInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor: <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Valor em centavos"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-12 mx-auto items-center" >
              <FormField
                control={form.control}
                name="isFixed"
                render={({ field }) => (
                  <FormItem className="flex gap-2 mt-6">
                    <FormControl>

                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Transação fixa</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="flex gap-2 mt-5">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Transação paga</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetClose asChild>
              <Button className="bg-[#584380] text-white hover:bg-[#8c78ba] cursor-pointer" type="submit">
                {transaction ? 'Salvar alterações' : 'Criar transação'}
              </Button>

            </SheetClose>
          </form>
        </Form>
      </SheetContent>
    </Sheet >
  );
};

const getCategories = async () => {
  const response = await fetch('http://localhost:3333/categories');
  return await response.json();
};

const createTransaction = async (transaction: Transaction) => {
  const response = await fetch("http://localhost:3333/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  return await response.json();
};

const updateTransaction = async (transaction: Transaction) => {
  const response = await fetch(`http://localhost:3333/transactions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  return await response.json();
};

