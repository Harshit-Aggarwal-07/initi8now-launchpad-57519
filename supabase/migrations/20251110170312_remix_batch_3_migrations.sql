
-- Migration: 20251110064813

-- Migration: 20251110061913

-- Migration: 20251109163913

-- Migration: 20251109152415
-- Create students waitlist table
CREATE TABLE public.students_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  college TEXT,
  area_of_interest TEXT NOT NULL,
  mobile_number TEXT,
  student_role TEXT,
  linkedin_url TEXT,
  other_work_links TEXT,
  preferred_industries TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  landing_page TEXT,
  user_type TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create recruiters waitlist table
CREATE TABLE public.recruiters_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  work_email TEXT NOT NULL UNIQUE,
  contact_person_name TEXT NOT NULL,
  hiring_for TEXT NOT NULL,
  requirement_details TEXT,
  hiring_interest TEXT NOT NULL,
  number_of_roles TEXT,
  universities_locations TEXT,
  contact_phone TEXT,
  quick_note TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  landing_page TEXT,
  user_type TEXT DEFAULT 'recruiter',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiters_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for waitlist)
CREATE POLICY "Allow public insert on students_waitlist"
ON public.students_waitlist
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert on recruiters_waitlist"
ON public.recruiters_waitlist
FOR INSERT
TO anon
WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_students_email ON public.students_waitlist(email);
CREATE INDEX idx_recruiters_email ON public.recruiters_waitlist(work_email);
CREATE INDEX idx_students_created ON public.students_waitlist(created_at);
CREATE INDEX idx_recruiters_created ON public.recruiters_waitlist(created_at);


-- Migration: 20251109164155
-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table to track admin users
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add SELECT policies for waitlist tables - only admins can view
CREATE POLICY "Admins can view student waitlist"
ON public.students_waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view recruiter waitlist"
ON public.recruiters_waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage user roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Migration: 20251110060326
-- Add unique constraints to prevent duplicate email submissions
ALTER TABLE public.students_waitlist
ADD CONSTRAINT students_waitlist_email_unique UNIQUE (email);

ALTER TABLE public.recruiters_waitlist
ADD CONSTRAINT recruiters_waitlist_work_email_unique UNIQUE (work_email);


-- Migration: 20251110062907
-- Create profiles table for user authentication
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_students_waitlist_created_at ON public.students_waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recruiters_waitlist_created_at ON public.recruiters_waitlist(created_at DESC);

-- Trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Migration: 20251110062920
-- Fix the handle_updated_at function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- Migration: 20251110065001
-- Add explicit DELETE policy for profiles table to prevent unauthorized deletions
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Migration: 20251110065432
-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  landing_page TEXT
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for newsletter signups
CREATE POLICY "Allow public insert on newsletter_subscribers"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Only admins can view newsletter subscribers
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
