-- Add is_public column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;

-- Create policy for public profile access (anyone can view public profiles)
CREATE POLICY "Anyone can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (is_public = true);

-- Create index for better performance on public profile queries
CREATE INDEX idx_profiles_public ON public.profiles(is_public, id) WHERE is_public = true;

-- Add view_count column for analytics
ALTER TABLE public.profiles 
ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;

-- Create profile_views table for tracking
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer_source TEXT, -- 'qr', 'whatsapp', 'direct', etc.
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on profile_views
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Policy for profile_views (anyone can insert, only profile owner can view)
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

-- Function to increment view count
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
