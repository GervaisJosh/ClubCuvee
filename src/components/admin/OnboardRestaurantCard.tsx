import React, { useState } from 'react';

const TIERS = [
  { label: 'Neighborhood Cellar', value: 'Neighborhood Cellar' },
  { label: 'World Class', value: 'World Class' },
];

const OnboardRestaurantCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [tier, setTier] = useState(TIERS[0].value);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/restaurant-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': import.meta.env.VITE_ADMIN_SECRET || '',
        },
        body: JSON.stringify({ email, tier }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to create invite');
      }
      setSuccess(data.inviteLink);
      setEmail('');
      setRestaurantName('');
      setTier(TIERS[0].value);
    } catch (err: any) {
      setError(err.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border-t-4 border-[#800020]">
      <h2 className="text-xl font-bold text-[#800020] mb-2">Onboard a New Restaurant</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#800020] focus:ring-[#800020]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
          <input
            type="text"
            required
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#800020] focus:ring-[#800020]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tier</label>
          <select
            value={tier}
            onChange={e => setTier(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#800020] focus:ring-[#800020]"
          >
            {TIERS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-[#800020] text-white rounded-md font-semibold hover:bg-[#a8324a] transition disabled:opacity-60"
        >
          {loading ? 'Inviting...' : 'Send Invite'}
        </button>
      </form>
      {success && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          Invite created! <a href={success} target="_blank" rel="noopener noreferrer" className="underline text-green-900">Copy Invite Link</a><br />
          <span className="text-xs break-all">{success}</span>
        </div>
      )}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      )}
    </div>
  );
};

export default OnboardRestaurantCard; 