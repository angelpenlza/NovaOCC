# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your NovaOCC application.

## Prerequisites

- A Supabase project
- A Google Cloud Platform (GCP) account
- Access to your Supabase dashboard

## Step 1: Create a Google OAuth Application

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** (unless you have a Google Workspace account)
   - Fill in the required fields:
     - App name: "NovaOCC" (or your app name)
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (if in testing mode)
   - Save and continue

6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "NovaOCC Web Client" (or any name)
   - **Authorized JavaScript origins**:
     - Add your development URL: `http://localhost:3000` (or your dev port)
     - Add your production URL: `https://yourdomain.com` (when deployed)
   - **Authorized redirect URIs**:
     - Add: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
     - You can find this in your Supabase dashboard URL or Settings → API
   - Click **Create**
   - **Important**: Copy the **Client ID** and **Client Secret** - you'll need these in the next step

## Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list of providers
5. Enable Google provider by toggling it on
6. Enter the following:
   - **Client ID (for OAuth)**: Paste the Client ID from Step 1
   - **Client Secret (for OAuth)**: Paste the Client Secret from Step 1
7. Click **Save**

## Step 3: Configure Redirect URLs in Supabase

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add your redirect URLs:
   - **Site URL**: Your production URL (e.g., `https://yourdomain.com`)
   - **Redirect URLs**: Add the following:
     - `http://localhost:3000/auth/callback` (for local development)
     - `http://localhost:3001/auth/callback` (if you use port 3001)
     - `https://yourdomain.com/auth/callback` (for production)
3. Click **Save**

## Step 4: Update Your Application

The application code is already set up to handle Google OAuth. Make sure your environment variables are configured:

1. Create or update `.env.local` in your `NovaOCC` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Get these values from:
   - Supabase Dashboard → Settings → API
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 5: Test Google OAuth

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:3000/login`

3. Click the **"Continue with Google"** button

4. You should be redirected to Google's sign-in page

5. After signing in with Google, you should be redirected back to your app

6. You should now be authenticated and redirected to the home page

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Cause**: The redirect URI in Google Cloud Console doesn't match Supabase's callback URL
- **Solution**: 
  - Make sure you added `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback` to Google Cloud Console
  - Verify your Supabase project reference is correct

### Error: "invalid_client"
- **Cause**: Incorrect Client ID or Client Secret in Supabase
- **Solution**: 
  - Double-check the Client ID and Client Secret in Supabase Dashboard
  - Make sure there are no extra spaces when copying/pasting

### Error: "access_denied"
- **Cause**: OAuth consent screen not configured or user denied access
- **Solution**: 
  - Configure the OAuth consent screen in Google Cloud Console
  - Make sure you've added test users (if in testing mode)
  - Publish your app (if you want to allow all users)

### OAuth callback not working
- **Cause**: Redirect URLs not configured correctly
- **Solution**: 
  - Verify redirect URLs in Supabase Dashboard → Authentication → URL Configuration
  - Make sure you added both local and production URLs
  - Check that the callback route exists: `/auth/callback`

### User not redirected after OAuth
- **Cause**: Callback handler not working correctly
- **Solution**: 
  - Check browser console for errors
  - Verify the callback page exists at `src/app/auth/callback/page.tsx`
  - Make sure Supabase client is configured correctly

## Production Deployment

When deploying to production:

1. **Update Google Cloud Console**:
   - Add your production domain to **Authorized JavaScript origins**
   - Add your production domain to **Authorized redirect URIs** (if needed)

2. **Update Supabase**:
   - Add your production URL to **Site URL**
   - Add your production callback URL to **Redirect URLs**

3. **Update Environment Variables**:
   - Set `NEXT_PUBLIC_SUPABASE_URL` to your production Supabase URL
   - Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your production anon key

## Additional Notes

- Google OAuth works for both sign-up and sign-in
- Users will be automatically created in Supabase when they sign in with Google for the first time
- User profile information (email, name) is automatically synced from Google
- The OAuth flow is secure and handles tokens automatically

## Security Considerations

- Never commit your `.env.local` file to version control
- Keep your Client Secret secure - it's only stored in Supabase Dashboard
- Use environment variables for all sensitive configuration
- Regularly rotate your OAuth credentials if compromised
- Monitor OAuth usage in Google Cloud Console

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase Dashboard → Authentication → Logs
3. Check Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs
4. Verify all URLs match exactly (including http vs https, trailing slashes, etc.)

