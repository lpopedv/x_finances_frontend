import { useForm } from "react-hook-form";
import { Transaction, transactionZodSchema } from "../schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../schemas/category";

interface TransactionsFormProps {
  transaction: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
}

export const TransactionsForm = ({ transaction, onSubmit }: TransactionsFormProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Transaction>({
    resolver: zodResolver(transactionZodSchema)
  });

  const { data: categoriesSelect } = useQuery({
    queryKey: ['categoriesSelect'],
    queryFn: getCategories
  });


  useEffect(() => {
    if (transaction) {
      setValue("categoryId", transaction.categoryId);
      setValue("title", transaction.title);
      setValue("movement", transaction.movement);
      setValue("valueInCents", transaction.valueInCents);
      setValue("date", transaction.date);
      setValue("isFixed", transaction.isFixed);
      setValue("isPaid", transaction.isPaid);
    }
  }, [transaction, setValue])

  const handleSubmitForm = (data: Transaction) => {
    if (transaction) {
      onSubmit({ ...data, id: transaction.id });
    } else {
      onSubmit(data);
    }

    setValue('categoryId', 0);
    setValue('title', '');
    setValue('movement', 'outgoing');
    setValue('valueInCents', 0);
    setValue('isFixed', false);
    setValue('isPaid', false);
  };

  console.log(categoriesSelect)

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <label htmlFor="categoryId">Categoria</label>
      <select id="categoryId" {...register('categoryId')}>
  {categoriesSelect?.map((category: Category) => (
    <option key={category.id} value={category.id}>{category.title}</option>
  ))}
</select>
      {errors.categoryId && <span>{errors.categoryId.message}</span>}

      <label htmlFor="title">Título</label>
      <input type="text" id="title" {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}

      <label htmlFor="movement">Movimento</label>
      <select id="movement" {...register('movement')}>
        <option value="income">Entrada</option>
        <option value="outgoing">Saída</option>
      </select>
      {errors.movement && <span>{errors.movement.message}</
      span>}


      <label htmlFor="valueInCents">Valor</label>
      <input type="number" id="valueInCents" {...register('valueInCents')} />
      {errors.valueInCents && <span>{errors.valueInCents.message}</span>}

      <label htmlFor="date">Data</label>
      <input type="date" id="date" {...register('date')} />
      {errors.date && <span>{errors.date.message}</span>}

      <label htmlFor="isFixed">É fixo?</label>
      <input type="checkbox" id="isFixed" {...register('isFixed')} />
      {errors.isFixed && <span>{errors.isFixed.message}</span>}

      <label htmlFor="isPaid">Está pago?</label>
      <input type="checkbox" id="isPaid" {...register('isPaid')} />
      {errors.isPaid && <span>{errors.isPaid.message}</span>}

      <button type="submit">{transaction ? 'Salvar alterações' : 'Criar transação'}</button>
    </form>
  )
}

const getCategories = async () => {
  const response = await fetch('http://localhost:3333/categories');
  return await response.json();
};