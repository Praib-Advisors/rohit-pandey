-- ======================================================================
-- Supabase Schema for Khalilabad Army Members
-- Table: khalilabad_army_members
-- ======================================================================

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.khalilabad_army_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  village_ward_area TEXT NOT NULL,
  age INTEGER,
  interested_area TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create indexes for quick lookup & search
CREATE INDEX IF NOT EXISTS idx_khalilabad_army_members_mobile 
  ON public.khalilabad_army_members(mobile);

CREATE INDEX IF NOT EXISTS idx_khalilabad_army_members_reg_id 
  ON public.khalilabad_army_members(registration_id);

CREATE INDEX IF NOT EXISTS idx_khalilabad_army_members_status 
  ON public.khalilabad_army_members(status);

CREATE INDEX IF NOT EXISTS idx_khalilabad_army_members_created 
  ON public.khalilabad_army_members(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.khalilabad_army_members ENABLE ROW LEVEL SECURITY;

-- 4. Policies:
-- Allow anonymous/public registration submission
DROP POLICY IF EXISTS "Allow public registration insert" ON public.khalilabad_army_members;
CREATE POLICY "Allow public registration insert"
  ON public.khalilabad_army_members
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role full access (API routes run using service role key)
DROP POLICY IF EXISTS "Allow service role full access" ON public.khalilabad_army_members;
CREATE POLICY "Allow service role full access"
  ON public.khalilabad_army_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
