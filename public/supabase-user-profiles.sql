-- User Profiles centralization SQL (Supabase)
-- This script creates the base tables (if missing), view, table, functions and triggers to keep user_profiles synchronized

-- BASE TABLES: dependências para a view e triggers
CREATE TABLE IF NOT EXISTS public.exercise_entries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid,
  workout_id text NOT NULL CHECK (workout_id = ANY (ARRAY['A','B','C','D','E'])),
  exercise_id text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  load text,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT exercise_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.workout_completions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid,
  workout_id text NOT NULL CHECK (workout_id = ANY (ARRAY['A','B','C','D','E'])),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workout_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- VIEW: últimas entradas por exercício e usuário
DROP VIEW IF EXISTS public.exercise_entries_latest;
CREATE OR REPLACE VIEW public.exercise_entries_latest AS
WITH ranked AS (
  SELECT
    e.*,
    ROW_NUMBER() OVER (
      PARTITION BY e.user_id, e.exercise_id
      ORDER BY e.date DESC, e.created_at DESC
    ) AS rn
  FROM public.exercise_entries e
)
SELECT
  id, user_id, workout_id, exercise_id, date, load, note, created_at, updated_at
FROM ranked
WHERE rn = 1;

-- TABELA: user_profiles (dados centralizados por usuário)
DROP TABLE IF EXISTS public.user_profiles;
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  exercise_entries jsonb NOT NULL DEFAULT '[]'::jsonb,
  workout_completions jsonb NOT NULL DEFAULT '[]'::jsonb,
  exercise_entries_latest jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- FUNÇÃO: atualizar/agregar dados em user_profiles
DROP FUNCTION IF EXISTS public.refresh_user_profiles() CASCADE;
CREATE OR REPLACE FUNCTION public.refresh_user_profiles()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    exercise_entries,
    workout_completions,
    exercise_entries_latest,
    updated_at
  )
  SELECT
    u.id,
    u.email,
    COALESCE(
      (
        SELECT jsonb_agg(to_jsonb(e) - 'user_id')
        FROM public.exercise_entries e
        WHERE e.user_id = u.id
      ),
      '[]'::jsonb
    ),
    COALESCE(
      (
        SELECT jsonb_agg(to_jsonb(w) - 'user_id')
        FROM public.workout_completions w
        WHERE w.user_id = u.id
      ),
      '[]'::jsonb
    ),
    COALESCE(
      (
        SELECT jsonb_agg(to_jsonb(el) - 'user_id')
        FROM public.exercise_entries_latest el
        WHERE el.user_id = u.id
      ),
      '[]'::jsonb
    ),
    now()
  FROM auth.users u
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    exercise_entries = EXCLUDED.exercise_entries,
    workout_completions = EXCLUDED.workout_completions,
    exercise_entries_latest = EXCLUDED.exercise_entries_latest,
    updated_at = now();
END;
$$;

-- TRIGGER helper (statement-level)
DROP FUNCTION IF EXISTS public.refresh_user_profiles_statement() CASCADE;
CREATE OR REPLACE FUNCTION public.refresh_user_profiles_statement()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.refresh_user_profiles();
  RETURN NULL;
END;
$$;

-- TRIGGERS: manter user_profiles sincronizado
DROP TRIGGER IF EXISTS trg_refresh_user_profiles_after_exercise_entries ON public.exercise_entries;
CREATE TRIGGER trg_refresh_user_profiles_after_exercise_entries
AFTER INSERT OR UPDATE OR DELETE ON public.exercise_entries
FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_user_profiles_statement();

DROP TRIGGER IF EXISTS trg_refresh_user_profiles_after_workout_completions ON public.workout_completions;
CREATE TRIGGER trg_refresh_user_profiles_after_workout_completions
AFTER INSERT OR UPDATE OR DELETE ON public.workout_completions
FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_user_profiles_statement();

-- POPULAÇÃO INICIAL (opcional)
-- SELECT public.refresh_user_profiles();