-- Supabase: tabela para salvar marcas do calendário (dias concluídos ou não)
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1) Tabela base
create table if not exists public.calendar_marks (
  id bigint generated always as identity primary key,
  user_id uuid,
  date date not null,
  status text not null check (status = any (array['completed','missed'])),
  created_at timestamp with time zone not null default now(),
  constraint calendar_marks_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- 2) Constraint de unicidade por usuário/dia (modo multiusuário)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'calendar_marks_unique_per_day'
  ) THEN
    ALTER TABLE public.calendar_marks
      ADD CONSTRAINT calendar_marks_unique_per_day
      UNIQUE (user_id, date);
  END IF;
END $$;

-- 3) RLS: habilitar e políticas para permitir que o usuário gerencie seus próprios registros
alter table public.calendar_marks enable row level security;

drop policy if exists calendar_marks_select_own on public.calendar_marks;
create policy calendar_marks_select_own
  on public.calendar_marks
  for select
  using (user_id = auth.uid());

drop policy if exists calendar_marks_insert_own on public.calendar_marks;
create policy calendar_marks_insert_own
  on public.calendar_marks
  for insert
  with check (user_id = auth.uid());

drop policy if exists calendar_marks_update_own on public.calendar_marks;
create policy calendar_marks_update_own
  on public.calendar_marks
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists calendar_marks_delete_own on public.calendar_marks;
create policy calendar_marks_delete_own
  on public.calendar_marks
  for delete
  using (user_id = auth.uid());

-- 4) Índices úteis
create index if not exists idx_calendar_marks_user_date on public.calendar_marks (user_id, date);
create index if not exists idx_calendar_marks_date on public.calendar_marks (date);

-- 5) Modo usuário único (sem autenticação) – execute APENAS se você quiser operar sem login
--    Para aplicar, remova os comentários e execute manualmente os comandos abaixo:
--    a) Desativar RLS
--    -- alter table public.calendar_marks disable row level security;
--    b) Ajustar unicidade baseada apenas na data
--    -- DO $$
--    -- BEGIN
--    --   IF EXISTS (
--    --     SELECT 1 FROM pg_constraint WHERE conname = 'calendar_marks_unique_per_day'
--    --   ) THEN
--    --     ALTER TABLE public.calendar_marks DROP CONSTRAINT calendar_marks_unique_per_day;
--    --   END IF;
--    --   IF NOT EXISTS (
--    --     SELECT 1 FROM pg_constraint WHERE conname = 'calendar_marks_unique_per_day_single'
--    --   ) THEN
--    --     ALTER TABLE public.calendar_marks
--    --       ADD CONSTRAINT calendar_marks_unique_per_day_single
--    --       UNIQUE (date);
--    --   END IF;
--    -- END $$;