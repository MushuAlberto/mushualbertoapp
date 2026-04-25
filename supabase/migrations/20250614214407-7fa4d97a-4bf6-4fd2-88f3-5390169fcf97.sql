
-- 1. Crear tabla de categorías personalizables por usuario
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#818cf8', -- Tailwind indigo-400 por default
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS para que cada usuario solo vea/salga sus categorías
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Solo el usuario puede ver sus categorías"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Solo el usuario puede insertar sus categorías"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Solo el usuario puede actualizar sus categorías"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Solo el usuario puede eliminar sus categorías"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Relacionar transacciones con categorías personalizadas
ALTER TABLE public.transactions 
  ADD COLUMN category_id UUID NULL REFERENCES public.categories(id);

-- (Opcional) Migrar datos previos: conservar el campo "category" como legacy por ahora.

-- 4. Permitir filtros: se recomienda crear un índice por user_id y date para mejorar la búsqueda
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date);

-- 5. (Opcional) Más estadísticas: puedes crear campos extra si los necesitas, pero para KPIs es mejor calcularlos en el frontend por ahora.
