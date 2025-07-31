-- Fix RLS policies for public profiles
-- First ensure the is_public column exists

-- Add is_public column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'is_public' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Add view_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'view_count' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON public.profiles;

-- Recreate policies with proper precedence
-- First policy: Allow users to view their own profiles (authenticated users)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Second policy: Allow anyone to view public profiles (including anonymous users)
CREATE POLICY "Public profiles are viewable by anyone" 
ON public.profiles 
FOR SELECT 
USING (is_public = true);

-- Ensure all existing profiles have is_public set to true by default
UPDATE public.profiles 
SET is_public = true 
WHERE is_public IS NULL;

-- Create profile_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer_source TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on profile_views if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'profile_views' 
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing profile_views policies
DROP POLICY IF EXISTS "Anyone can log profile views" ON public.profile_views;
DROP POLICY IF EXISTS "Profile owners can view their analytics" ON public.profile_views;

-- Recreate profile_views policies
CREATE POLICY "Anyone can log profile views" 
ON public.profile_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Profile owners can view their analytics" 
ON public.profile_views 
FOR SELECT 
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create or replace function to increment view count
CREATE OR REPLACE FUNCTION public.increment_profile_views(profile_uuid UUID, ref_source TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Increment view count
  UPDATE public.profiles 
  SET view_count = view_count + 1 
  WHERE id = profile_uuid AND is_public = true;
  
  -- Log the view
  INSERT INTO public.profile_views (profile_id, referrer_source)
  VALUES (profile_uuid, ref_source);
END;
$$;

-- Create index for better performance on public profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_public ON public.profiles(is_public, id) WHERE is_public = true;
