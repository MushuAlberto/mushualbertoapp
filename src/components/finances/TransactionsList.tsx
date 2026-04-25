import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, Edit, Trash2 } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import EditTransactionModal from './EditTransactionModal';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category_id?: string | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const [localTransactions, setLocalTransactions] = useLocalStorage<Transaction[]>('mushu_transactions', []);
  const [categories] = useLocalStorage<Category[]>('mushu_categories', []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInit, setEditInit] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta transacción?')) return;
    
    const updatedTransactions = localTransactions.filter(t => t.id !== id);
    setLocalTransactions(updatedTransactions);
    sonnerToast.success('Transacción eliminada.');
  };

  const handleEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditInit({
      type: tx.type,
      amount: tx.amount,
      date: tx.date,
      description: tx.description,
    });
    setIsEditModalOpen(true);
  };

  const saveEdit = async (formData: any) => {
    if (!editingId) return;
    
    const updatedTransactions = localTransactions.map(t => 
      t.id === editingId ? { ...t, ...formData } : t
    );
    setLocalTransactions(updatedTransactions);
    sonnerToast.success('Transacción actualizada.');
    setEditingId(null);
    setEditInit(null);
  };

  if (transactions.length === 0) {
    return <p className="text-center text-gray-500 py-10">No has añadido ninguna transacción todavía.</p>;
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const cat = categories.find((c: Category) => c.id === tx.category_id);
            return (
              <TableRow key={tx.id}>
                <TableCell>
                  {tx.type === 'income' ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{tx.description}</TableCell>
                <TableCell>
                  {cat ? (
                    <Badge style={{ backgroundColor: cat.color, color: "#fff" }}>{cat.name}</Badge>
                  ) : (
                    <Badge variant="outline">Sin categoría</Badge>
                  )}
                </TableCell>
                <TableCell>{format(parseISO(tx.date), 'dd MMM yyyy', { locale: es })}</TableCell>
                <TableCell
                  className={`text-right font-semibold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  ${Number(tx.amount).toFixed(2)}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <button
                    className="inline-flex items-center px-2 py-1 text-xs rounded hover:bg-accent"
                    title="Editar"
                    onClick={() => handleEdit(tx)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="inline-flex items-center px-2 py-1 text-xs rounded hover:bg-accent text-red-700"
                    title="Eliminar"
                    onClick={() => handleDelete(tx.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <EditTransactionModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingId(null);
        }}
        initialData={editInit}
        onSave={saveEdit}
      />
    </div>
  );
};

export default TransactionsList;