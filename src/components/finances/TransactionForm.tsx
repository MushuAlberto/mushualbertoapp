import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast as sonnerToast } from 'sonner';
import { format } from 'date-fns';
import CategorySelect from "./CategorySelect";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category_id?: string | null;
  createdAt: string;
}

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('El monto debe ser positivo'),
  description: z.string().min(3, 'La descripción es muy corta.'),
  date: z.string().nonempty('La fecha es requerida.'),
  category_id: z.string().optional().nullable(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const TransactionForm: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('mushu_transactions', []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: 0,
      category_id: null,
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: data.type,
      date: data.date,
      amount: data.amount,
      description: data.description.trim(),
      category_id: data.category_id || null,
      createdAt: new Date().toISOString(),
    };
    
    setTransactions([newTransaction, ...transactions]);
    sonnerToast.success('¡Transacción añadida exitosamente!');
    reset();
    setValue('date', format(new Date(), 'yyyy-MM-dd'));
    setValue('type', 'expense');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select
            onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
            defaultValue={watch('type')}
            value={watch('type')}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Egreso</SelectItem>
              <SelectItem value="income">Ingreso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Monto</Label>
          <Input id="amount" type="number" step="0.01" {...register('amount')} placeholder="0.00" />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="category_id">Categoría</Label>
        <CategorySelect
          value={watch("category_id") ?? null}
          onChange={catId => setValue("category_id", catId)}
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" {...register('description')} placeholder="Café, salario, etc." />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="date">Fecha</Label>
        <Input id="date" type="date" {...register('date')} />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
      </div>
      <Button type="submit" className="w-full">
        Añadir Transacción
      </Button>
    </form>
  );
};

export default TransactionForm;