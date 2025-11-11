'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ReportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    address_text: '',
    latitude: '',
    longitude: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please log in to submit a report');
        router.push('/login');
        return;
      }

      // Validate coordinates
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);

      if (isNaN(lat) || isNaN(lon)) {
        alert('Please enter valid latitude and longitude');
        setLoading(false);
        return;
      }

      // Option 1: Use the insert_report RPC function (recommended)
      // This function handles geometry creation on the database side
      const { data: reportId, error: rpcError } = await supabase.rpc(
        'insert_report',
        {
          p_user_id: user.id,
          p_category: formData.category,
          p_title: formData.title,
          p_description: formData.description,
          p_address_text: formData.address_text,
          p_lat: lat,
          p_lon: lon,
        }
      );

      if (!rpcError && reportId) {
        // Success using RPC function
        alert('Report submitted successfully!');
        router.push('/');
        setLoading(false);
        return;
      }

      // Option 2: Fallback - create geometry first, then insert
      console.warn('RPC function not available, trying alternative method...');
      const { data: geomData, error: geomError } = await supabase.rpc(
        'create_point',
        { lat, lon }
      );

      if (geomError) {
        console.error('Error creating geometry:', geomError);
        alert(
          'Error submitting report: ' +
            (rpcError?.message || geomError.message) +
            '\n\nPlease ensure you have run the database migration (supabase_migrations.sql) in your Supabase SQL Editor.'
        );
        setLoading(false);
        return;
      }

      // Insert report with the created geometry
      const { data, error } = await supabase
        .from('reports')
        .insert([
          {
            user_id: user.id,
            category: formData.category,
            title: formData.title,
            description: formData.description,
            address_text: formData.address_text,
            geom: geomData,
            status: 'unverified',
            confidence_score: 0.5,
            media_count: 0,
          },
        ])
        .select();

      if (error) {
        console.error('Error submitting report:', error);
        alert('Error submitting report: ' + error.message);
      } else {
        alert('Report submitted successfully!');
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the report');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Submit a Safety Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="theft">Theft</option>
            <option value="vandalism">Vandalism</option>
            <option value="assault">Assault</option>
            <option value="burglary">Burglary</option>
            <option value="traffic">Traffic Incident</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the incident"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide details about the incident..."
          />
        </div>

        <div>
          <label htmlFor="address_text" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address_text"
            name="address_text"
            value={formData.address_text}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Street address or location"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="33.6846"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-117.8265"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

