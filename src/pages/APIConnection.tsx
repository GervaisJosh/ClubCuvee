import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { getAPIKeys, connectToBinWise } from '../services/apiServices';
import { Wine, Key } from 'lucide-react';

const APIConnection = () => {
  const [binwiseKey, setBinwiseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get the restaurant_id for the current user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('restaurant_id')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Store API key
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          restaurant_id: userData.restaurant_id,
          binwise_key: binwiseKey,
        }, { onConflict: 'restaurant_id' });

      if (error) throw error;

      setSuccess('BinWise API key stored successfully');

      // Fetch stored API key
      const storedKeys = await getAPIKeys(userData.restaurant_id);

      // Connect to BinWise API
      const binwiseData = await connectToBinWise(storedKeys.binwise_key);

      setSuccess(prev => `${prev}\nBinWise connection successful, data incoming.`);

      // Store the API data in local storage (in a real app, you'd store this in a database)
      localStorage.setItem('apiData', JSON.stringify({ binwise: binwiseData }));

      setTimeout(() => {
        navigate('/admin-real');
      }, 2000);

    } catch (error) {
      setError(`Error connecting to BinWise: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-xl shadow-lg border border-gray-800">
        <div className="text-center">
          <Wine className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Connect Your Data</h2>
          <p className="mt-2 text-sm text-gray-400">Enter your BinWise API key to sync your wine inventory data</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleConnect}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="binwise-key" className="sr-only">BinWise API Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="binwise-key"
                  name="binwise-key"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter BinWise API Key"
                  value={binwiseKey}
                  onChange={(e) => setBinwiseKey(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default APIConnection;
