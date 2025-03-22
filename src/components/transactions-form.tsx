import { useForm } from "react-hook-form";
import { format } from "date-fns"
import { Transaction, transactionZodSchema } from "../schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { TransactionRequests } from "~/requests/transactions-request";
import { CategoryRequests } from "~/requests/categories-request";

interface TransactionsFormProps {
  transaction?: Transaction
}

export const TransactionsForm = ({ transaction }: TransactionsFormProps) => {
  const form = useForm<Transaction>({
    resolver: zodResolver(transactionZodSchema),
    defaultValues: {
      id: transaction?.id,
      category_id: transaction?.category_id ?? 0,
      title: transaction?.title ?? '',
      movement: transaction?.movement ?? 'outgoing',
      value_in_cents: transaction?.value_in_cents ?? 0,
      date: transaction?.date ? new Date(transaction.date) : undefined,
      due_date: transaction?.due_date ? new Date(transaction.due_date) : undefined,
      is_fixed: transaction?.is_fixed ?? false,
      is_paid: transaction?.is_paid ?? false,
    }
  });

  const { data: categoriesSelect } = useQuery({
    queryKey: ['categoriesSelect'],
    queryFn: CategoryRequests.getAllCategoriesData
  });

  const [rawValue, setRawValue] = useState('')

  useEffect(() => {
    if (transaction?.value_in_cents) {
      const initialValue = (transaction.value_in_cents / 100).toFixed(2)
      setRawValue(initialValue)
    }
  }, [transaction])

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    value = value.replace(/^0+/, '')

    if (value.length === 0) {
      setRawValue('')
      form.setValue('value_in_cents', 0)
      return
    }

    const paddedValue = value.padStart(3, '0')
    const cents = parseInt(paddedValue.slice(0, -2) + paddedValue.slice(-2), 10)
    form.setValue('value_in_cents', cents)

    const formatted = (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    setRawValue(formatted)
  }

  const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      setRawValue('R$ 0,00')
      form.setValue('value_in_cents', 0)
      return
    }
  }

  const handleCurrencyFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
    const value = e.target.value.replace(/\D/g, '')
    setRawValue(value || '')
  }

  const queryClient = useQueryClient()

  useEffect(() => {
    if (categoriesSelect?.length > 0 && !transaction && form.getValues('category_id') === 0) {
      form.setValue('category_id', categoriesSelect[0].id);
    }
  }, [categoriesSelect, form, transaction]);

  const createTransactionMutation = useMutation({
    mutationFn: TransactionRequests.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTransactions"] })
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: TransactionRequests.updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTransactions"] })
    },
  });

  const handleFormSubmit = (transaction: Transaction) => {
    if (transaction.id !== undefined) {
      updateTransactionMutation.mutate(transaction);
    } else {
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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria: <span className="text-red-500">*</span> </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={`${field.value}`}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesSelect?.map((category: Category) => (
                        <SelectItem key={category.id} value={`${category.id}`}>
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
              name="value_in_cents"
              render={() => (
                <FormItem>
                  <FormLabel>Valor: <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      value={rawValue}
                      onChange={handleCurrencyChange}
                      onBlur={handleCurrencyBlur}
                      onFocus={handleCurrencyFocus}
                      inputMode="numeric"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-12 mx-auto items-center" >
              <FormField
                control={form.control}
                name="is_fixed"
                render={({ field }) => (
                  <FormItem className="flex gap-2 mt-6">
                    <FormControl>

                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="mt-1">
                      <FormLabel>fixa?</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex gap-2 mt-5">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="mt-1">
                      <FormLabel>Já paga?</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="flex flex-col gap-4 justify-between">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Data da transação:</FormLabel>
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("pl-3 text-left font-normal flex-1", !field.value && "text-muted-foreground")}
                            >

                              {field.value ? format(field.value, "PPP") : <span>Selecione uma data</span>}
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
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Data de vencimento:</FormLabel>
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal flex-1',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
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
                    </div>
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




