'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Map from '@/components/Map';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  async function fetchReports() {
    try {
      setLoading(true);
      // Fetch reports with geometry
      // Supabase automatically converts PostGIS geometry to GeoJSON format
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
        alert('Error fetching reports: ' + error.message);
      } else {
        setReports(data || []);
        console.log('Fetched reports:', data?.length || 0);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching reports');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('unverified')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'unverified'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unverified
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'verified'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'resolved'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resolved
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading reports...</div>
        ) : (
          <Map reports={reports} />
        )}
      </div>
    </div>
  );
}

