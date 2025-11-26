-- Add INSERT policy for lecturers to create courses
CREATE POLICY "Lecturers can create courses"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (
  lecturer_id = auth.uid() AND 
  has_role(auth.uid(), 'lecturer'::app_role)
);