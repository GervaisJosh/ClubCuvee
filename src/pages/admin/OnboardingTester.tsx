import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminGuard from '../../components/admin/AdminGuard';

const OnboardingTester: React.FC = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [apiStatus, setApiStatus] = useState<any>({
    loading: true,
    status: 'Checking API status...',
    statusType: '',
    data: null,
  });
  const [invitationForm, setInvitationForm] = useState({
    email: '',
    restaurant_name: '',
    website: '',
    admin_name: '',
    tier: 'standard',
  });
  const [invitationResult, setInvitationResult] = useState<any>({
    show: false,
    status: '',
    statusType: '',
    data: null,
  });
  const [tierForm, setTierForm] = useState({
    name: '',
    price: '',
    description: '',
    restaurant_id: '',
  });
  const [tierResult, setTierResult] = useState<any>({
    show: false,
    status: '',
    statusType: '',
    data: null,
  });

  useEffect(() => {
    if (activeTab === 'status') {
      checkApiStatus();
    }
  }, [activeTab]);

  const checkApiStatus = async () => {
    setApiStatus({
      loading: true,
      status: 'Checking API status...',
      statusType: '',
      data: null,
    });

    try {
      const response = await fetch('/api/verify-stripe');
      
      if (response.ok) {
        const data = await response.json();
        setApiStatus({
          loading: false,
          status: 'API is online!',
          statusType: 'success',
          data,
        });
      } else {
        setApiStatus({
          loading: false,
          status: `API responded with an error: ${response.status} ${response.statusText}`,
          statusType: 'error',
          data: null,
        });
      }
    } catch (error: any) {
      setApiStatus({
        loading: false,
        status: `Could not connect to API: ${error.message}`,
        statusType: 'error',
        data: null,
      });
    }
  };

  const handleInvitationFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvitationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvitationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setInvitationResult({
      show: true,
      status: 'Processing...',
      statusType: '',
      data: null,
    });
    
    try {
      const response = await fetch('/api/restaurant-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationForm),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setInvitationResult({
          show: true,
          status: 'Invitation Created Successfully!',
          statusType: 'success',
          data,
        });
      } else {
        setInvitationResult({
          show: true,
          status: `Error Creating Invitation: ${data.error || 'Unknown error'}`,
          statusType: 'error',
          data,
        });
      }
    } catch (error: any) {
      setInvitationResult({
        show: true,
        status: `Request Failed: ${error.message}`,
        statusType: 'error',
        data: null,
      });
    }
  };

  const handleTierFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTierForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTierResult({
      show: true,
      status: 'Creating membership tier...',
      statusType: '',
      data: null,
    });
    
    try {
      const response = await fetch('/api/membership-tiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tierForm),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTierResult({
          show: true,
          status: `Membership Tier "${tierForm.name}" Created Successfully!`,
          statusType: 'success',
          data,
        });
      } else {
        setTierResult({
          show: true,
          status: `Error Creating Tier: ${data.error || 'Unknown error'}`,
          statusType: 'error',
          data,
        });
      }
    } catch (error: any) {
      setTierResult({
        show: true,
        status: `Request Failed: ${error.message}`,
        statusType: 'error',
        data: null,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Onboarding Tester</h1>
            <span className="text-sm bg-[#872657] text-white px-3 py-1 rounded-md">
              Admin Tool
            </span>
          </div>
          
          <div className="tabs flex border-b border-gray-200 space-x-2">
            {['status', 'invitation', 'membership', 'workflow'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium rounded-t-md ${
                  activeTab === tab
                    ? 'bg-[#872657] text-white border border-[#872657] border-b-0'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'status' && 'API Status'}
                {tab === 'invitation' && 'Restaurant Invitations'}
                {tab === 'membership' && 'Membership Tiers'}
                {tab === 'workflow' && 'Full Workflow'}
              </button>
            ))}
          </div>
          
          {/* API Status Tab */}
          {activeTab === 'status' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-[#872657] mb-4">API Status</h2>
              
              <div className={`p-4 rounded-md mb-6 ${
                apiStatus.statusType === 'success' ? 'bg-green-50 text-green-800' :
                apiStatus.statusType === 'error' ? 'bg-red-50 text-red-800' :
                'bg-gray-50 text-gray-800'
              }`}>
                {apiStatus.loading ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full border-2 border-t-transparent border-[#872657] animate-spin"></div>
                    <p>{apiStatus.status}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg mb-2">
                      {apiStatus.statusType === 'success' ? '✅' : apiStatus.statusType === 'error' ? '❌' : ''}
                      {' '}{apiStatus.status}
                    </h3>
                    
                    {apiStatus.data && (
                      <div>
                        <p>Stripe configuration status: {apiStatus.data.status}</p>
                        <p>Live mode: {apiStatus.data.livemode ? 'Yes (CAUTION: using live keys)' : 'No (using test keys)'}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Environment Variables</h3>
              <div className="mb-6">
                {apiStatus.data?.config ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2 border-b">Environment Variable</th>
                        <th className="text-left p-2 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b">STRIPE_SECRET_KEY</td>
                        <td className="p-2 border-b">
                          {apiStatus.data.config.STRIPE_SECRET_KEY === 'configured' ? 
                            '✅ Configured' : '❌ Missing'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">VITE_STRIPE_PUBLIC_KEY</td>
                        <td className="p-2 border-b">
                          {apiStatus.data.config.VITE_STRIPE_PUBLIC_KEY === 'configured' ? 
                            '✅ Configured' : '❌ Missing'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">STRIPE_WEBHOOK_SECRET</td>
                        <td className="p-2 border-b">
                          {apiStatus.data.config.STRIPE_WEBHOOK_SECRET === 'configured' ? 
                            '✅ Configured' : '❌ Missing'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 italic">No configuration data available</p>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">API Endpoints</h3>
              <div>
                {[
                  { path: '/api/verify-stripe', method: 'GET', description: 'Check Stripe configuration' },
                  { path: '/api/restaurant-invite', method: 'POST', description: 'Generate restaurant invitation' },
                  { path: '/api/create-checkout-session', method: 'POST', description: 'Create Stripe checkout session' },
                  { path: '/api/stripe-webhook', method: 'POST', description: 'Handle Stripe webhooks' },
                  { path: '/api/membership-tiers', method: 'POST/PUT', description: 'Manage membership tiers' }
                ].map((endpoint, index) => (
                  <div key={index} className="p-3 mb-2 border-l-4 border-[#872657] bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono font-medium">
                          <span className="font-bold text-[#872657]">{endpoint.method}</span> {endpoint.path}
                        </p>
                        <p className="text-gray-600 text-sm">{endpoint.description}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(endpoint.path)}
                        className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-100"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Restaurant Invitations Tab */}
          {activeTab === 'invitation' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-[#872657] mb-4">Generate Restaurant Invitation</h2>
              
              <form onSubmit={handleInvitationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="restaurant@example.com"
                    className="w-full p-2 border rounded-md"
                    value={invitationForm.email}
                    onChange={handleInvitationFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="restaurant_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name*
                  </label>
                  <input
                    type="text"
                    id="restaurant_name"
                    name="restaurant_name"
                    required
                    placeholder="Example Restaurant"
                    className="w-full p-2 border rounded-md"
                    value={invitationForm.restaurant_name}
                    onChange={handleInvitationFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website (optional)
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="https://example.com"
                    className="w-full p-2 border rounded-md"
                    value={invitationForm.website}
                    onChange={handleInvitationFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="admin_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Name (optional)
                  </label>
                  <input
                    type="text"
                    id="admin_name"
                    name="admin_name"
                    placeholder="John Smith"
                    className="w-full p-2 border rounded-md"
                    value={invitationForm.admin_name}
                    onChange={handleInvitationFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Pricing Tier
                  </label>
                  <div className="space-y-3">
                    {['NeighborhoodCellar', 'EstablishedShop', 'PremiumCollection', 'LuxuryVintage'].map((tierName) => (
                      <div key={tierName} className="flex items-center">
                        <input
                          type="radio"
                          id={`tier_${tierName}`}
                          name="tier"
                          value={tierName}
                          checked={invitationForm.tier === tierName}
                          onChange={handleInvitationFormChange}
                          className="w-4 h-4 text-[#872657] focus:ring-[#872657] border-gray-300"
                        />
                        <label 
                          htmlFor={`tier_${tierName}`} 
                          className={`ml-2 block text-sm font-medium ${invitationForm.tier === tierName ? 'text-[#872657]' : 'text-gray-700'}`}
                        >
                          {tierName === 'NeighborhoodCellar' && 'Neighborhood Cellar - $199/mo'}
                          {tierName === 'EstablishedShop' && 'Established Shop - $349/mo'}
                          {tierName === 'PremiumCollection' && 'Premium Collection - $599/mo'}
                          {tierName === 'LuxuryVintage' && 'Luxury Vintage - $999/mo'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#800020] to-[#872657] text-white rounded-lg hover:bg-[#6d1f46] transition shadow-md flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Generate Restaurant Invitation
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    This will create an invitation link you can share with the restaurant admin.
                  </p>
                </div>
              </form>
              
              {invitationResult.show && (
                <div className={`mt-6 p-4 rounded-md ${
                  invitationResult.statusType === 'success' ? 'bg-green-50 text-green-800' :
                  invitationResult.statusType === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-gray-50 text-gray-800'
                }`}>
                  <h3 className="font-bold text-lg mb-2">
                    {invitationResult.statusType === 'success' ? '✅' : invitationResult.statusType === 'error' ? '❌' : ''}
                    {' '}{invitationResult.status}
                  </h3>
                  
                  {invitationResult.data && invitationResult.statusType === 'success' && (
                    <div className="space-y-4">
                      <div className="border border-green-200 rounded-lg bg-green-50 overflow-hidden">
                        <div className="bg-green-100 px-4 py-2 flex justify-between items-center">
                          <h4 className="font-medium text-green-800">Invitation URL Ready</h4>
                          <button 
                            onClick={() => copyToClipboard(invitationResult.data.invitation_url)}
                            className="text-xs px-3 py-1 bg-white border border-green-300 rounded-full text-green-700 hover:bg-green-50 shadow-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                            Copy URL
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="font-mono text-sm bg-white p-3 rounded-md border border-green-200 break-all">
                            <a href={invitationResult.data.invitation_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {invitationResult.data.invitation_url + (invitationResult.data.invitation_url.includes('?') ? '&' : '?') + `tier=${invitationForm.tier}`}
                            </a>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-md border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Invitation Token</p>
                              <p className="font-mono text-sm">{invitationResult.data.invitation.token}</p>
                            </div>
                            <div className="bg-white p-3 rounded-md border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Expiration</p>
                              <p className="font-mono text-sm">{new Date(invitationResult.data.invitation.expires_at).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <p className="text-sm text-yellow-800 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-yellow-600">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              The tier parameter has been appended to the URL. Share this link with the restaurant to begin onboarding.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-1">Full Response:</h4>
                        <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                          {JSON.stringify(invitationResult.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {invitationResult.data && invitationResult.statusType === 'error' && (
                    <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs mt-2">
                      {JSON.stringify(invitationResult.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Membership Tiers Tab */}
          {activeTab === 'membership' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-[#872657] mb-4">Create Membership Tier</h2>
              
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md mb-6">
                <p className="font-medium">Note: You must have a restaurant account created before you can create membership tiers.</p>
              </div>
              
              <form onSubmit={handleTierSubmit} className="space-y-4">
                <div>
                  <label htmlFor="tier_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tier Name*
                  </label>
                  <input
                    type="text"
                    id="tier_name"
                    name="name"
                    required
                    placeholder="Bronze Level"
                    className="w-full p-2 border rounded-md"
                    value={tierForm.name}
                    onChange={handleTierFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="tier_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Price* ($)
                  </label>
                  <input
                    type="number"
                    id="tier_price"
                    name="price"
                    required
                    min="1"
                    step="0.01"
                    placeholder="49.99"
                    className="w-full p-2 border rounded-md"
                    value={tierForm.price}
                    onChange={handleTierFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="tier_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="tier_description"
                    name="description"
                    placeholder="One bottle per month, personalized selections"
                    className="w-full p-2 border rounded-md"
                    value={tierForm.description}
                    onChange={handleTierFormChange}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="restaurant_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant ID*
                  </label>
                  <input
                    type="text"
                    id="restaurant_id"
                    name="restaurant_id"
                    required
                    placeholder="123e4567-e89b-12d3-a456-426614174000"
                    className="w-full p-2 border rounded-md"
                    value={tierForm.restaurant_id}
                    onChange={handleTierFormChange}
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#872657] text-white rounded-md hover:bg-[#6d1f46] transition"
                  >
                    Create Tier
                  </button>
                </div>
              </form>
              
              {tierResult.show && (
                <div className={`mt-6 p-4 rounded-md ${
                  tierResult.statusType === 'success' ? 'bg-green-50 text-green-800' :
                  tierResult.statusType === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-gray-50 text-gray-800'
                }`}>
                  <h3 className="font-bold text-lg mb-2">
                    {tierResult.statusType === 'success' ? '✅' : tierResult.statusType === 'error' ? '❌' : ''}
                    {' '}{tierResult.status}
                  </h3>
                  
                  {tierResult.data && tierResult.statusType === 'success' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Details:</h4>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <th className="text-left p-2 border-b bg-gray-50">Tier ID</th>
                            <td className="p-2 border-b">{tierResult.data.id}</td>
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-b bg-gray-50">Name</th>
                            <td className="p-2 border-b">{tierResult.data.name}</td>
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-b bg-gray-50">Price</th>
                            <td className="p-2 border-b">
                              ${parseFloat(tierResult.data.price).toFixed(2)}/month
                            </td>
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-b bg-gray-50">Restaurant ID</th>
                            <td className="p-2 border-b">{tierResult.data.restaurant_id}</td>
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-b bg-gray-50">Stripe Product ID</th>
                            <td className="p-2 border-b">{tierResult.data.stripe_product_id}</td>
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-b bg-gray-50">Stripe Price ID</th>
                            <td className="p-2 border-b">{tierResult.data.stripe_price_id}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div>
                        <h4 className="font-medium mb-1">Full Response:</h4>
                        <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                          {JSON.stringify(tierResult.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {tierResult.data && tierResult.statusType === 'error' && (
                    <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs mt-2">
                      {JSON.stringify(tierResult.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Full Workflow Tab */}
          {activeTab === 'workflow' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-[#872657] mb-6">Full Onboarding Workflow</h2>
              
              <div className="space-y-6">
                <div className="pl-6 border-l-4 border-[#872657]">
                  <h3 className="flex items-center text-xl font-medium mb-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#872657] text-white text-sm mr-2">1</span>
                    Generate Invitation
                  </h3>
                  <p className="text-gray-700">
                    Create a secure invitation link for a restaurant by using the Restaurant Invitations tab.
                  </p>
                </div>
                
                <div className="pl-6 border-l-4 border-[#872657]">
                  <h3 className="flex items-center text-xl font-medium mb-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#872657] text-white text-sm mr-2">2</span>
                    Restaurant Registration
                  </h3>
                  <p className="text-gray-700">
                    Have the restaurant admin open the invitation link: <code className="bg-gray-100 px-2 py-1 rounded">/onboarding/[token]</code>
                  </p>
                  <p className="text-gray-700 mt-1">
                    They will complete the registration form and undergo Stripe checkout if required.
                  </p>
                </div>
                
                <div className="pl-6 border-l-4 border-[#872657]">
                  <h3 className="flex items-center text-xl font-medium mb-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#872657] text-white text-sm mr-2">3</span>
                    Create Membership Tiers
                  </h3>
                  <p className="text-gray-700">
                    After registration, the restaurant admin will create membership tiers that will be stored in Supabase and created as products/prices in Stripe.
                  </p>
                </div>
                
                <div className="pl-6 border-l-4 border-[#872657]">
                  <h3 className="flex items-center text-xl font-medium mb-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#872657] text-white text-sm mr-2">4</span>
                    Verify Stripe Integration
                  </h3>
                  <p className="text-gray-700">
                    Check the Stripe dashboard to confirm that products and prices have been created with the correct metadata.
                  </p>
                </div>
                
                <div className="pl-6 border-l-4 border-[#872657]">
                  <h3 className="flex items-center text-xl font-medium mb-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#872657] text-white text-sm mr-2">5</span>
                    Customer Subscription
                  </h3>
                  <p className="text-gray-700">
                    Customers can now subscribe to membership tiers at: <code className="bg-gray-100 px-2 py-1 rounded">/join/[restaurantId]</code>
                  </p>
                </div>
                
                <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-md">
                  <h3 className="font-bold mb-2">Testing Tips</h3>
                  <p className="mb-2">When testing payments with Stripe:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use test card number: <code className="bg-yellow-100 px-1 rounded">4242 4242 4242 4242</code></li>
                    <li>Any future expiry date, any 3-digit CVC, any postal code</li>
                    <li>For testing failure scenarios, use: <code className="bg-yellow-100 px-1 rounded">4000 0000 0000 0002</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default OnboardingTester;