-- Create users table to map Clerk users to Supabase
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (clerk_id = auth.uid());

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (clerk_id = auth.uid());

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (clerk_id = auth.uid())
  WITH CHECK (clerk_id = auth.uid());

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 