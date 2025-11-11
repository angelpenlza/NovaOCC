# NovaOCC Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Environment Variables

Create `.env.local` in the `NovaOCC` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase Dashboard → Settings → API

### 2. Database Setup

1. Open Supabase SQL Editor
2. Run `supabase_migrations.sql` to create helper functions
3. Run `RLS_POLICIES.sql` to set up security policies
4. Verify PostGIS is enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Test

- Visit http://localhost:3000/test-db to test connection
- Visit http://localhost:3000/login to sign up
- Visit http://localhost:3000/reports/new to submit a report

## 📁 Key Files

- `src/lib/supabaseClient.ts` - Supabase client configuration
- `src/app/page.tsx` - Main map view
- `src/app/reports/new/page.tsx` - Report submission form
- `src/app/admin/dashboard/page.tsx` - Admin dashboard
- `supabase_migrations.sql` - Database functions for PostGIS
- `RLS_POLICIES.sql` - Row Level Security policies

## 🗺️ Next Steps

1. **Integrate Mapping Library**: Add Leaflet, Mapbox, or Google Maps to `src/components/Map.tsx`
2. **Add Geocoding**: Convert addresses to coordinates automatically
3. **Image Uploads**: Add media upload functionality
4. **Clustering**: Implement marker clustering for better performance
5. **Notifications**: Add email/push notifications for new reports

## 🐛 Troubleshooting

**Database connection fails:**
- Check `.env.local` has correct values
- Verify Supabase project is active
- Run database migrations

**Geometry insertion fails:**
- Ensure PostGIS extension is enabled
- Run `supabase_migrations.sql`
- Check `geom` column type is `geometry(Point, 4326)`

**Authentication issues:**
- Check Supabase Auth is enabled
- Verify email confirmation settings
- Check RLS policies are set up correctly

## 📚 Documentation

See `SETUP.md` for detailed setup instructions.

