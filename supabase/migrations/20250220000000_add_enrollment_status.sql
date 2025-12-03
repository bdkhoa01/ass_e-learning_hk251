alter table public.enrollments
add column if not exists status text not null default 'approved';
