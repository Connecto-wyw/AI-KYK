-- supabase/migrations/0001_kyk_results_premium.sql

ALTER TABLE kyk_results
ADD COLUMN IF NOT EXISTS base_type text,
ADD COLUMN IF NOT EXISTS sub_type text,
ADD COLUMN IF NOT EXISTS concern text,
ADD COLUMN IF NOT EXISTS full_report_json jsonb;

-- Allow users to update their own report_json (if generated via client, otherwise Service Role bypasses this)
CREATE POLICY "Users can update own kyk_results"
ON kyk_results FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
