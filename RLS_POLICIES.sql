-- Row Level Security (RLS) Policies for NovaOCC
-- Run this in your Supabase SQL Editor after setting up your tables

-- Enable RLS on reports table
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reports (public access)
CREATE POLICY "Anyone can read reports" 
ON reports FOR SELECT 
USING (true);

-- Policy: Authenticated users can insert their own reports
CREATE POLICY "Users can insert their own reports" 
ON reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reports
CREATE POLICY "Users can update their own reports" 
ON reports FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own reports
CREATE POLICY "Users can delete their own reports" 
ON reports FOR DELETE 
USING (auth.uid() = user_id);

-- Policy: Admins can update any report
-- Note: This assumes you have a users table with a role column
-- If your users table structure is different, adjust this policy accordingly
CREATE POLICY "Admins can update any report" 
ON reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy: Admins can delete any report
CREATE POLICY "Admins can delete any report" 
ON reports FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- If you have a users table, enable RLS on it as well
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
-- CREATE POLICY "Users can read own profile" 
-- ON users FOR SELECT 
-- USING (auth.uid() = id);

-- Policy: Users can update their own profile
-- CREATE POLICY "Users can update own profile" 
-- ON users FOR UPDATE 
-- USING (auth.uid() = id)
-- WITH CHECK (auth.uid() = id);

-- Policy: Anyone can read user profiles (for display names, etc.)
-- CREATE POLICY "Anyone can read user profiles" 
-- ON users FOR SELECT 
-- USING (true);

