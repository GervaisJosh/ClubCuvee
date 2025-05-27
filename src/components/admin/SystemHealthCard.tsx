import React, { useEffect, useState } from 'react';

const SYSTEMS = [
  { key: 'supabase', label: 'Supabase' },
  { key: 'stripe', label: 'Stripe' },
  { key: 'auth', label: 'Auth' },
];

const STATUS_ICON: Record<string, string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
};

const SystemHealthCard: React.FC = () => {
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin-system-check', {
          headers: {
            'x-admin-auth': import.meta.env.VITE_ADMIN_SECRET || '',
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'Failed to check system health');
        }
        setStatus(data.systems);
      } catch (err: any) {
        setError(err.message || 'Failed to check system health');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border-t-4 border-[#800020]">
      <h2 className="text-xl font-bold text-[#800020] mb-2">System Health Check</h2>
      {loading ? (
        <div className="text-gray-500">Checking system status...</div>
      ) : error ? (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {SYSTEMS.map(sys => (
            <li key={sys.key} className="flex items-center gap-3">
              <span className="text-2xl">{STATUS_ICON[status[sys.key] || 'red']}</span>
              <span className="font-medium text-gray-800">{sys.label}</span>
              <span className="ml-2 text-xs text-gray-500">{status[sys.key] === 'green' ? 'Operational' : 'Degraded'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SystemHealthCard; 