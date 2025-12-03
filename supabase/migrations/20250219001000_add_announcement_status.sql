-- Add status column for announcements to support approval flow
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Default existing rows to approved
UPDATE public.announcements SET status = 'approved' WHERE status IS NULL;
