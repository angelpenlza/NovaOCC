# Environment Variables Setup

## Quick Fix for the Current Error

You're seeing the error because the `.env.local` file is missing. Follow these steps:

### Step 1: Create `.env.local` file

Create a new file named `.env.local` in the `NovaOCC` directory with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one if you haven't)
3. Navigate to **Settings** → **API**
4. You'll find two values:
   - **Project URL**: Copy this (it looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key**: Copy this (it's a long string)

### Step 3: Update `.env.local`

Replace the placeholder values in `.env.local` with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Restart Your Dev Server

After creating/updating `.env.local`:

1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. The error should be resolved!

## File Location

Make sure the `.env.local` file is in the correct location:
```
NovaOCC/
  ├── .env.local          ← Create this file here
  ├── package.json
  ├── src/
  └── ...
```

## Troubleshooting

### Error: "Invalid supabaseUrl"
- Make sure the URL starts with `https://`
- Check for any extra spaces or quotes
- The URL should look like: `https://xxxxxxxxxxxxx.supabase.co`

### Error: "Missing Supabase environment variables"
- Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
- Make sure the file is in the `NovaOCC` directory (same level as `package.json`)
- Restart your dev server after creating the file
- Make sure variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Still Having Issues?

1. Check that your `.env.local` file doesn't have any syntax errors
2. Make sure you're using the `anon public` key (not the `service_role` key)
3. Verify your Supabase project is active and running
4. Try clearing the Next.js cache: `rm -rf .next` (or `rmdir /s /q .next` on Windows)

## Security Note

⚠️ **Never commit `.env.local` to git!** It contains sensitive credentials. The file is already in `.gitignore` and won't be committed.

