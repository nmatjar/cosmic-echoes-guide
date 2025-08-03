-- Add role column to profiles table for admin access control
ALTER TABLE public.profiles
ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Optional: Add an index if you query by role often
CREATE INDEX idx_profiles_role ON public.profiles(role);
