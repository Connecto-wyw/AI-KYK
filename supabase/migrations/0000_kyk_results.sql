-- supabase/migrations/0000_kyk_results.sql

CREATE TABLE kyk_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  device_id text, -- optional tracking
  answers jsonb, -- { step1: [], step2: {}, step3: {} }
  result_type text not null, -- e.g. 'DOG', 'MONKEY'
  result_summary text,
  result_detail jsonb, -- Contains axisScores
  created_at timestamp with time zone default now()
);

-- Enable RLS
ALTER TABLE kyk_results ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own results
CREATE POLICY "Users can read own kyk_results"
ON kyk_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own results
-- Alternatively, allow server functionality only with Service Role, but we can enable HTTP API insertions
CREATE POLICY "Users can insert own kyk_results"
ON kyk_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Prevent Updates (Immutable results)
-- (No UPDATE policy defined means it's closed)
