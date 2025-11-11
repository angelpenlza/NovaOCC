'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Cora
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`px-4 py-2 rounded transition ${
                pathname === '/'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Map
            </Link>
            <Link
              href="/reports/new"
              className={`px-4 py-2 rounded transition ${
                pathname === '/reports/new'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Report Incident
            </Link>
            <Link
              href="/admin/dashboard"
              className={`px-4 py-2 rounded transition ${
                pathname === '/admin/dashboard'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Admin
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded transition"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded transition ${
                  pathname === '/login'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

