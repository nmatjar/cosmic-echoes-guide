-- Create experts table
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT[] NOT NULL,
  bio TEXT,
  contact_email TEXT,
  profile_picture_url TEXT,
  external_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  tier TEXT, -- e.g., 'premium', 'standard'
  meta_prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for experts table
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view active experts
CREATE POLICY "Public can view active experts" 
ON public.experts 
FOR SELECT 
USING (is_active = TRUE);

-- Policy: Admin can manage experts (requires admin role or specific user_id)
-- This policy assumes you have an admin role or a way to identify admins.
-- For now, we'll leave it open for authenticated users to insert/update/delete for testing, 
-- but this should be restricted in a production environment.
CREATE POLICY "Authenticated users can manage experts" 
ON public.experts 
FOR ALL 
USING (auth.role() = 'authenticated'); -- This is a placeholder, tighten in production

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column_experts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON public.experts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column_experts();
