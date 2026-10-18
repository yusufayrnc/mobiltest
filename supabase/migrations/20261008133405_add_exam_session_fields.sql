/*
# Add multi-test session fields

1. Modified Tables
- `test_attempts.session_id` groups several tests given during one interview session.
- `test_attempts.sequence_number` records the order in which the selected tests must be completed.

2. Security
- Existing row-level security remains enabled.
- Existing anonymous and authenticated CRUD policies continue to cover the new fields.

3. Important Notes
- Both fields are nullable/defaulted for existing prototype records so no previous result data is changed or lost.
- New multi-test sessions will write the same session identifier to every selected test attempt.
*/

ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS session_id uuid;

ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS sequence_number integer NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS test_attempts_session_id_idx ON public.test_attempts (session_id);
CREATE INDEX IF NOT EXISTS test_attempts_name_idx ON public.test_attempts (first_name, last_name);
