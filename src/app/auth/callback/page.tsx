'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for errors in the hash or query params first
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          router.push('/login?error=' + encodeURIComponent(errorDescription || error));
          return;
        }

        // Get the hash from the URL (Supabase OAuth returns tokens in the hash)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Handle PKCE flow (code exchange)
        const code = hashParams.get('code') || searchParams.get('code');
        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            router.push('/login?error=' + encodeURIComponent(exchangeError.message));
            return;
          }

          // Successfully authenticated
          router.push('/');
          router.refresh();
          return;
        }

        // Handle implicit flow (tokens in hash)
        if (accessToken && refreshToken) {
          // Set the session using the tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            router.push('/login?error=' + encodeURIComponent(sessionError.message));
            return;
          }

          // Successfully authenticated, redirect to home
          router.push('/');
          router.refresh();
          return;
        }

        // No tokens or code found - check if we're waiting for redirect
        if (type === 'recovery') {
          // This is a password recovery flow
          router.push('/login?message=' + encodeURIComponent('Please check your email for password reset instructions'));
          return;
        }

        // No authentication data found
        console.warn('No authentication data found in callback URL');
        router.push('/login?error=' + encodeURIComponent('Authentication failed: No tokens received'));
      } catch (error: any) {
        console.error('Error in auth callback:', error);
        router.push('/login?error=' + encodeURIComponent(error.message || 'Authentication failed'));
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

