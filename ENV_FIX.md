# 🔧 Quick Fix: Environment Variables Swapped

## The Problem

Your `.env.local` file has the **values swapped**. The error shows that `NEXT_PUBLIC_SUPABASE_URL` contains a JWT token (your anon key) instead of a URL.

## The Solution

### Step 1: Open your `.env.local` file

The file should be located at: `NovaOCC/.env.local`

### Step 2: Check Your Current Values

Your file probably looks something like this (WRONG):

```env
NEXT_PUBLIC_SUPABASE_URL=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ❌ This is the KEY, not the URL!
NEXT_PUBLIC_SUPABASE_ANON_KEY=https://xxxxx.supabase.co  ❌ This is the URL, not the KEY!
```

### Step 3: Fix the Values

Swap them so it looks like this (CORRECT):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co  ✅ This should be a URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ✅ This should be a JWT token
```

## How to Identify Each Value

### ✅ NEXT_PUBLIC_SUPABASE_URL
- **Looks like**: `https://xxxxxxxxxxxxx.supabase.co`
- **Starts with**: `https://`
- **Contains**: Your project ID
- **Location in Supabase**: Settings → API → **Project URL**

### ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Looks like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...`
- **Starts with**: `eyJ` (base64 encoded JWT)
- **Very long**: Usually 200+ characters
- **Location in Supabase**: Settings → API → **anon public** key

## Step-by-Step Fix

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Navigate to Settings → API**
   - You'll see two sections:
     - **Project URL** (starts with `https://`)
     - **Project API keys** → **anon public** (long JWT string)

3. **Update your `.env.local` file**:

```env
# Copy the "Project URL" here (starts with https://)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Copy the "anon public" key here (long JWT string starting with eyJ)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Save the file**

5. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## Example of Correct Format

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDc1NTU1NTU5fQ.example_signature_here
```

## Quick Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` starts with `eyJ`
- [ ] No extra spaces or quotes around the values
- [ ] File is saved as `.env.local` (not `.env.local.txt`)
- [ ] File is in the `NovaOCC` directory
- [ ] Dev server has been restarted

## Still Having Issues?

If you're still seeing errors after fixing:

1. **Double-check the values** in Supabase Dashboard
2. **Make sure there are no spaces** before/after the `=` sign
3. **Don't use quotes** around the values
4. **Clear Next.js cache**: Delete the `.next` folder and restart
5. **Verify the file location**: Should be `NovaOCC/.env.local`

---

**Need help?** The error message should now be clear about what's wrong. Make sure:
- The URL is actually a URL (starts with `https://`)
- The key is actually a key (long JWT string)


