
-- Crear tabla para entradas del diario de vida con user_id como UUID
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Políticas para que cada usuario sólo vea y edite sus propios diarios
CREATE POLICY "Usuarios pueden ver sus propios diarios"
  ON public.journal_entries
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuarios pueden insertar sus propios diarios"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuarios pueden editar sus propios diarios"
  ON public.journal_entries
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Usuarios pueden borrar sus propios diarios"
  ON public.journal_entries
  FOR DELETE
  USING (user_id = auth.uid());
