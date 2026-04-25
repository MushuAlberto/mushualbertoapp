
-- Crear tipo ENUM para el tipo de transacción
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

-- Crear tabla para transacciones
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type public.transaction_type NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  category text, -- La IA llenará esto
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para transacciones
CREATE POLICY "Los usuarios pueden ver sus propias transacciones"
  ON public.transactions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Los usuarios pueden insertar sus propias transacciones"
  ON public.transactions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Los usuarios pueden actualizar sus propias transacciones"
  ON public.transactions
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Los usuarios pueden eliminar sus propias transacciones"
  ON public.transactions
  FOR DELETE
  USING (user_id = auth.uid());
