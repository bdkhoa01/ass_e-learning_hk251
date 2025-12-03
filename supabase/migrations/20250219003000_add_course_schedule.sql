-- Add schedule column (JSON) for courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS schedule JSONB;
