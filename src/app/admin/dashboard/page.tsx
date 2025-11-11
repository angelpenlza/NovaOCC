'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabaseClient';

interface Report {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  address_text: string;
  created_at: string;
  user_id: string;
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('unverified');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  async function fetchReports() {
    try {
      setLoading(true);
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        setReports(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateReportStatus(reportId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) {
        console.error('Error updating report:', error);
        alert('Error updating report: ' + error.message);
      } else {
        alert('Report status updated successfully!');
        fetchReports();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the report');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setFilter('unverified')}
            className={`px-4 py-2 rounded ${
              filter === 'unverified'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unverified
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded ${
              filter === 'verified'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded ${
              filter === 'resolved'
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
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Category:</span> {report.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Status:</span>{' '}
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          report.status === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'unverified'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Address:</span> {report.address_text}
                    </p>
                    <p className="text-gray-700 mb-2">{report.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {report.status === 'unverified' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report.id, 'verified')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {report.status === 'verified' && (
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No reports found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

