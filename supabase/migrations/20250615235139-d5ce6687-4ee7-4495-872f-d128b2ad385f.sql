
-- Actualizar las políticas RLS para la tabla categories para permitir operaciones sin autenticación real
DROP POLICY IF EXISTS "Solo el usuario puede ver sus categorías" ON public.categories;
DROP POLICY IF EXISTS "Solo el usuario puede insertar sus categorías" ON public.categories;
DROP POLICY IF EXISTS "Solo el usuario puede actualizar sus categorías" ON public.categories;
DROP POLICY IF EXISTS "Solo el usuario puede eliminar sus categorías" ON public.categories;

-- Crear nuevas políticas que permitan operaciones para el usuario por defecto
CREATE POLICY "Permitir operaciones para usuario por defecto"
  ON public.categories FOR ALL
  USING (user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid)
  WITH CHECK (user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid);

-- También actualizar las políticas para transactions si existen problemas similares
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias transacciones" ON public.transactions;
DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propias transacciones" ON public.transactions;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias transacciones" ON public.transactions;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias transacciones" ON public.transactions;

CREATE POLICY "Permitir operaciones de transacciones para usuario por defecto"
  ON public.transactions FOR ALL
  USING (user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid)
  WITH CHECK (user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid);
