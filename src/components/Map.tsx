'use client';

import { useEffect, useRef, useState } from 'react';

interface Report {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  geom: string;
  address_text: string;
  created_at: string;
}

interface MapProps {
  reports: Report[];
}

export default function Map({ reports }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // For now, we'll use a simple Leaflet map or create a basic map visualization
    // You can integrate with Leaflet, Mapbox, or Google Maps later
    if (mapRef.current && !mapLoaded) {
      // Initialize a basic map container
      // This is a placeholder - you'll want to integrate with a proper mapping library
      setMapLoaded(true);
    }
  }, [mapLoaded]);

  // Parse PostGIS geometry - handles multiple formats
  const parseGeometry = (geom: any) => {
    if (!geom) return null;

    // If it's already an object with coordinates
    if (typeof geom === 'object' && geom.coordinates) {
      return {
        longitude: geom.coordinates[0],
        latitude: geom.coordinates[1],
      };
    }

    // If it's a string in WKT format: POINT(lon lat) or SRID=4326;POINT(lon lat)
    if (typeof geom === 'string') {
      const match = geom.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
      if (match) {
        return {
          longitude: parseFloat(match[1]),
          latitude: parseFloat(match[2]),
        };
      }
    }

    // If Supabase returns it as GeoJSON
    if (typeof geom === 'object' && geom.type === 'Point' && Array.isArray(geom.coordinates)) {
      return {
        longitude: geom.coordinates[0],
        latitude: geom.coordinates[1],
      };
    }

    return null;
  };

  // Group reports by status for color coding
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'unverified':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-gray-500';
      case 'archived':
        return 'bg-gray-300';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={mapRef}
        className="w-full h-96 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">Map Visualization</p>
          <p className="text-sm">
            {reports.length} report{reports.length !== 1 ? 's' : ''} loaded
          </p>
          <p className="text-xs mt-2">
            Integrate with Leaflet, Mapbox, or Google Maps for full mapping functionality
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const coords = parseGeometry(report.geom);
          return (
            <div
              key={report.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{report.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${getStatusColor(
                    report.status
                  )} text-white`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{report.category}</p>
              <p className="text-sm text-gray-700 mb-2">{report.description}</p>
              <p className="text-xs text-gray-500">{report.address_text}</p>
              {coords && (
                <p className="text-xs text-gray-400 mt-2">
                  {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reports found. Be the first to submit a report!
        </div>
      )}
    </div>
  );
}

