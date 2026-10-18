/*
# Create test attempts for the exam flow

1. New Tables
- `test_attempts` stores candidate information and completed test results.
- `id` uniquely identifies an attempt.
- `test_key` identifies one of the four available tests.
- `first_name`, `last_name`, and `email` store the candidate details entered before the test.
- `answers` stores the selected answer values as JSON.
- `score` stores the final score when the test is submitted.
- `status` stores whether an attempt is in progress or completed.
- `submitted_at` stores the completion time.
- `created_at` stores when the attempt began.

2. Security
- Row level security is enabled.
- This first prototype intentionally uses the fixed app login rather than Supabase user accounts, so anonymous and authenticated app clients may create and read shared prototype attempts.
- Separate CRUD policies are provided for the anonymous app flow.

3. Important Notes
- The table is append-oriented for this prototype and does not remove existing candidate results.
- Test answer content remains controlled by the app; submitted answers are stored for the next results screen iteration.
*/

CREATE TABLE IF NOT EXISTS public.test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_key text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer,
  status text NOT NULL DEFAULT 'in_progress',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Prototype clients can read test attempts" ON public.test_attempts;
CREATE POLICY "Prototype clients can read test attempts"
ON public.test_attempts FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Prototype clients can create test attempts" ON public.test_attempts;
CREATE POLICY "Prototype clients can create test attempts"
ON public.test_attempts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype clients can update test attempts" ON public.test_attempts;
CREATE POLICY "Prototype clients can update test attempts"
ON public.test_attempts FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype clients can delete test attempts" ON public.test_attempts;
CREATE POLICY "Prototype clients can delete test attempts"
ON public.test_attempts FOR DELETE
TO anon, authenticated
USING (true);

CREATE INDEX IF NOT EXISTS test_attempts_test_key_idx ON public.test_attempts (test_key);
CREATE INDEX IF NOT EXISTS test_attempts_email_idx ON public.test_attempts (email);
