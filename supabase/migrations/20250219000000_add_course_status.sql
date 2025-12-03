-- Add status column for course approval flow
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Ensure existing rows are marked approved
UPDATE public.courses SET status = 'approved' WHERE status IS NULL;
