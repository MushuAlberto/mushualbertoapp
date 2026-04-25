
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import CategorySelect from "./CategorySelect";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("El monto debe ser positivo"),
  description: z.string().min(3, "La descripción es muy corta."),
  date: z.string().nonempty("La fecha es requerida."),
  category_id: z.string().uuid().optional().nullable(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  initialData: TransactionFormData;
  onSave: (data: TransactionFormData) => Promise<void>;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  open,
  onClose,
  initialData,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData,
    values: initialData // ensures sync on prop changes
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transacción</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (formData) => {
            await onSave(formData);
            onClose();
          })}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as "income" | "expense")
                }
                value={watch("type")}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Egreso</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <Label htmlFor="amount">Monto</Label>
              <Input id="amount" type="number" step="0.01" {...register("amount")} />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              )}
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
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;
