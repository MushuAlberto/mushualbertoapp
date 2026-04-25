
-- Tabla: tasks
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla: habits
CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  frequency text DEFAULT 'daily',
  streak int DEFAULT 0,
  last_completed date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Habilita Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Políticas: solo el usuario puede ver/modificar sus datos
CREATE POLICY "Permitir a cada usuario ver sus tareas"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario insertar sus tareas"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario modificar sus tareas"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario eliminar sus tareas"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario ver sus hábitos"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario insertar sus hábitos"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario modificar sus hábitos"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Permitir a cada usuario eliminar sus hábitos"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

