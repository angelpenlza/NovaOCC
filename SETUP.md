# NovaOCC Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account and project created
- Supabase tables created (`users` and `reports`)

## Environment Variables

1. Create a `.env.local` file in the `NovaOCC` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

## Database Setup

### 1. Run Database Migration

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase_migrations.sql`
4. Run the migration to create the necessary functions

### 2. Verify Table Structure

Ensure your `reports` table has the following structure:

```sql
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'unverified',
  geom geometry(Point, 4326) NOT NULL,
  address_text text,
  confidence_score float DEFAULT 0.5,
  media_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 3. Enable PostGIS Extension

In Supabase SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 4. Set Up Row Level Security (RLS)

Run these policies in your Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reports
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
USING (auth.uid() = user_id);

-- Policy: Admins can update any report
CREATE POLICY "Admins can update any report" 
ON reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
NovaOCC/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (map view)
│   │   ├── login/           # Login page
│   │   ├── reports/
│   │   │   └── new/         # New report form
│   │   └── admin/
│   │       └── dashboard/   # Admin dashboard
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Map.tsx          # Map visualization
│   │   └── ReportForm.tsx   # Report submission form
│   └── lib/
│       └── supabaseClient.ts # Supabase client
├── supabase_migrations.sql  # Database functions
└── .env.local              # Environment variables (create this)
```

## Testing the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the test page: [http://localhost:3000/test-db](http://localhost:3000/test-db)
   - This page will test your database connection
   - Check that all tests pass

3. Navigate to the home page: [http://localhost:3000](http://localhost:3000)
   - Check the browser console for any connection errors
   - Verify that reports load (if any exist)

4. Test authentication:
   - Navigate to [http://localhost:3000/login](http://localhost:3000/login)
   - Sign up for a new account
   - Sign in with your credentials

5. Test report submission:
   - Sign in to your account
   - Navigate to [http://localhost:3000/reports/new](http://localhost:3000/reports/new)
   - Submit a test report with valid coordinates
   - Example coordinates for Orange County, CA:
     - Latitude: 33.6846
     - Longitude: -117.8265

## Next Steps

- Integrate a proper mapping library (Leaflet, Mapbox, or Google Maps)
- Add image upload functionality for reports
- Implement report clustering on the map
- Add geocoding for address-to-coordinates conversion
- Set up email notifications
- Add report verification workflow

## Troubleshooting

### Database Connection Issues

- Verify your `.env.local` file has the correct Supabase URL and key
- Check that your Supabase project is active
- Ensure the database functions from `supabase_migrations.sql` are created

### Geometry Insertion Errors

- Make sure PostGIS extension is enabled
- Verify the `geom` column is of type `geometry(Point, 4326)`
- Check that the database functions are created and have proper permissions

### Authentication Issues

- Ensure Supabase Auth is enabled in your project
- Check that email confirmation is configured (or disabled for development)
- Verify RLS policies allow the operations you're trying to perform

