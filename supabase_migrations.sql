-- Supabase Migration File
-- Run this in your Supabase SQL Editor to set up the geometry insertion function

-- Function to create a Point geometry from latitude and longitude
-- This function will be called via RPC from your application
CREATE OR REPLACE FUNCTION create_point(lat double precision, lon double precision)
RETURNS geometry AS $$
BEGIN
  RETURN ST_SetSRID(ST_MakePoint(lon, lat), 4326);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_point(double precision, double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION create_point(double precision, double precision) TO anon;

-- Alternative: Create a function that inserts a report with geometry
-- This can be used as an alternative to direct inserts
CREATE OR REPLACE FUNCTION insert_report(
  p_user_id uuid,
  p_category text,
  p_title text,
  p_description text,
  p_address_text text,
  p_lat double precision,
  p_lon double precision
)
RETURNS uuid AS $$
DECLARE
  report_id uuid;
BEGIN
  INSERT INTO reports (
    user_id,
    category,
    title,
    description,
    address_text,
    geom,
    status,
    confidence_score,
    media_count
  ) VALUES (
    p_user_id,
    p_category,
    p_title,
    p_description,
    p_address_text,
    ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326),
    'unverified',
    0.5,
    0
  ) RETURNING id INTO report_id;
  
  RETURN report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION insert_report(uuid, text, text, text, text, double precision, double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_report(uuid, text, text, text, text, double precision, double precision) TO anon;

-- Note: Make sure your reports table has the geom column defined as:
-- geom geometry(Point, 4326)
-- 
-- Also ensure RLS (Row Level Security) policies are set up appropriately
-- Example RLS policies (adjust based on your requirements):
-- 
-- Enable RLS on reports table
-- ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
--
-- Policy: Users can read all reports
-- CREATE POLICY "Anyone can read reports" ON reports FOR SELECT USING (true);
--
-- Policy: Authenticated users can insert their own reports
-- CREATE POLICY "Users can insert their own reports" ON reports FOR INSERT 
--   WITH CHECK (auth.uid() = user_id);
--
-- Policy: Users can update their own reports, admins can update any
-- CREATE POLICY "Users can update their own reports" ON reports FOR UPDATE 
--   USING (auth.uid() = user_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Optional: Create a view that returns geometry as GeoJSON
-- This makes it easier to work with geometries in the frontend
CREATE OR REPLACE VIEW reports_geojson AS
SELECT 
  id,
  user_id,
  category,
  title,
  description,
  status,
  ST_AsGeoJSON(geom)::json AS geom,
  address_text,
  confidence_score,
  media_count,
  created_at,
  updated_at
FROM reports;

-- Grant access to the view
GRANT SELECT ON reports_geojson TO authenticated;
GRANT SELECT ON reports_geojson TO anon;

-- Note: You can query this view instead of the reports table if you prefer GeoJSON format:
-- SELECT * FROM reports_geojson;

