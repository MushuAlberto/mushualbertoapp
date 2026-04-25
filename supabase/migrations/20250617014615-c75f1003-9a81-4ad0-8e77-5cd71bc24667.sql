
-- Actualizar políticas RLS para journal_entries
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios diarios" ON public.journal_entries;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios diarios" ON public.journal_entries;
DROP POLICY IF EXISTS "Usuarios pueden editar sus propios diarios" ON public.journal_entries;
DROP POLICY IF EXISTS "Usuarios pueden borrar sus propios diarios" ON public.journal_entries;

CREATE POLICY "Usuarios pueden ver sus propios diarios"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios diarios"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus propios diarios"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden borrar sus propios diarios"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Actualizar políticas RLS para tasks
DROP POLICY IF EXISTS "Permitir a cada usuario ver sus tareas" ON public.tasks;
DROP POLICY IF EXISTS "Permitir a cada usuario insertar sus tareas" ON public.tasks;
DROP POLICY IF EXISTS "Permitir a cada usuario modificar sus tareas" ON public.tasks;
DROP POLICY IF EXISTS "Permitir a cada usuario eliminar sus tareas" ON public.tasks;

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

-- Actualizar políticas RLS para habits
DROP POLICY IF EXISTS "Permitir a cada usuario ver sus hábitos" ON public.habits;
DROP POLICY IF EXISTS "Permitir a cada usuario insertar sus hábitos" ON public.habits;
DROP POLICY IF EXISTS "Permitir a cada usuario modificar sus hábitos" ON public.habits;
DROP POLICY IF EXISTS "Permitir a cada usuario eliminar sus hábitos" ON public.habits;

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

-- Actualizar políticas RLS para transactions
DROP POLICY IF EXISTS "Permitir operaciones de transacciones para usuario por defecto" ON public.transactions;

CREATE POLICY "Los usuarios pueden ver sus propias transacciones"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias transacciones"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias transacciones"
  ON public.transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias transacciones"
  ON public.transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Actualizar políticas RLS para categories
DROP POLICY IF EXISTS "Permitir operaciones para usuario por defecto" ON public.categories;

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

-- Actualizar políticas RLS para push_subscriptions
DROP POLICY IF EXISTS "Only owner can view their push subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Only owner can insert their push subscription" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Only owner can update their push subscription" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Only owner can delete their push subscription" ON public.push_subscriptions;

CREATE POLICY "Only owner can view their push subscriptions" ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only owner can insert their push subscription" ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Only owner can update their push subscription" ON public.push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Only owner can delete their push subscription" ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);
