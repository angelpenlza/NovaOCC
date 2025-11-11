'use client';

import { useEffect, useState } from 'react';
import { testDBConnection } from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const testResult = await testDBConnection();
      setResult(testResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  const testReportsQuery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .limit(5);

      setResult({
        success: !error,
        data,
        error: error?.message,
      });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      setResult({
        success: !error,
        user: user ? { id: user.id, email: user.email } : null,
        error: error?.message,
      });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

        <div className="space-y-4 mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Test DB Connection
          </button>
          <button
            onClick={testReportsQuery}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 ml-2"
          >
            Test Reports Query
          </button>
          <button
            onClick={testAuth}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 ml-2"
          >
            Test Auth
          </button>
        </div>

        {loading && <div className="text-blue-600">Testing...</div>}

        {result && (
          <div
            className={`p-4 rounded ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <h2 className="font-bold mb-2">
              {result.success ? '✅ Success' : '❌ Error'}
            </h2>
            <pre className="bg-white p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold mb-2">Environment Variables Check</h3>
          <p className="text-sm">
            NEXT_PUBLIC_SUPABASE_URL:{' '}
            {process.env.NEXT_PUBLIC_SUPABASE_URL
              ? '✅ Set'
              : '❌ Not set'}
          </p>
          <p className="text-sm">
            NEXT_PUBLIC_SUPABASE_ANON_KEY:{' '}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? '✅ Set'
              : '❌ Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}

