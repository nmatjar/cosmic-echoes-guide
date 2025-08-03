-- Add subscription-related columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN subscription_plan TEXT NOT NULL DEFAULT 'free',
ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active',
ADD COLUMN subscription_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN stripe_customer_id TEXT;

-- Optional: Add indexes for frequently queried columns if needed
-- CREATE INDEX idx_profiles_subscription_plan ON public.profiles(subscription_plan);
-- CREATE INDEX idx_profiles_subscription_status ON public.profiles(subscription_status);
