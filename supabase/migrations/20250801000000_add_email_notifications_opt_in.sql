-- Add receive_daily_emails column to profiles table
ALTER TABLE public.profiles
ADD COLUMN receive_daily_emails BOOLEAN NOT NULL DEFAULT FALSE;
