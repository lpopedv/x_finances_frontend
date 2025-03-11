import { useForm } from "react-hook-form";
import { format } from "date-fns"
import { Transaction, transactionZodSchema } from "../schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../schemas/category";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { Card } from "./ui/card";

interface TransactionsFormProps {
  transaction: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
}

export const TransactionsForm = ({ transaction, onSubmit }: TransactionsFormProps) => {
  const form = useForm<Transaction>({
    resolver: zodResolver(transactionZodSchema),
    defaultValues: {
      categoryId: transaction?.categoryId ?? 0,
      title: transaction?.title ?? '',
      movement: transaction?.movement ?? 'outgoing',
      valueInCents: transaction?.valueInCents ?? 0,
      date: transaction?.date ?? new Date().toISOString(),
      isFixed: transaction?.isFixed ?? false,
      isPaid: transaction?.isPaid ?? false,
    }
  });

  const { data: categoriesSelect } = useQuery({
    queryKey: ['categoriesSelect'],
    queryFn: getCategories
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        categoryId: transaction.categoryId,
        title: transaction.title,
        movement: transaction.movement,
        valueInCents: transaction.valueInCents,
        date: transaction.date,
        isFixed: transaction.isFixed,
        isPaid: transaction.isPaid,
      });
    }
  }, [transaction, form]);

  const handleSubmitForm = (data: Transaction) => {
    if (transaction) {
      onSubmit({ ...data, id: transaction.id });
    } else {
      onSubmit(data);
    }
    form.reset({
      categoryId: 0,
      title: '',
      movement: 'outgoing',
      valueInCents: 0,
      date: '',
      isFixed: false,
      isPaid: false,
    });
  };

  useEffect(() => {
    if (categoriesSelect?.length > 0 && !transaction && form.getValues('categoryId') === 0) {
      form.setValue('categoryId', categoriesSelect[0].id);
    }
  }, [categoriesSelect, form, transaction]);

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="flex gap-8 p-4 rounded-4xl items-center">

          <div className="flex flex-col gap-2">
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
                    value={field.value.toString()} // Substitua defaultValue por value
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
          </div>

          <div className="flex gap-2 flex-col">
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
          </div>

          <div className="flex flex-col gap-4" >
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
                    <FormLabel>É fixo?</FormLabel>
                    <FormDescription>
                      Marque se essa transação é fixa
                    </FormDescription>
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
                    <FormLabel>Está pago?</FormLabel>
                    <FormDescription>
                      Marque se ela já foi paga
                    </FormDescription>
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
                <FormItem>
                  <FormLabel>Data:</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Data em que foi realizada</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="bg-[#584380] text-white hover:bg-[#8c78ba] cursor-pointer" type="submit">
            {transaction ? 'Salvar alterações' : 'Criar transação'}
          </Button>
        </form>
      </Form>


    </Card>
  );
};

const getCategories = async () => {
  const response = await fetch('http://localhost:3333/categories');
  return await response.json();
};
