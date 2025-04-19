import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../supabase';
import { ensureUserStatsExists } from '../../services/userService';
import { fetchRecommendations } from '../../utils/recommendationClient';
import DefaultText from '../../components/DefaultText';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';

/**
 * Admin diagnostic page to test critical functionality
 * Used for verifying fixes for known issues
 */
const DiagnosticsTest: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = '#800020';

  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Check auth_id mapping
  const checkAuthIdMapping = async () => {
    setLoading(prev => ({ ...prev, authId: true }));
    try {
      const { data, error } = await supabase
        .from('users')
        .select('local_id, auth_id, email')
        .eq('auth_id', user?.id || '')
        .single();

      if (error) {
        throw new Error(`Auth ID mapping error: ${error.message}`);
      }

      setResults(prev => ({ 
        ...prev, 
        authIdMapping: {
          success: true,
          local_id: data.local_id,
          auth_id: data.auth_id,
          email: data.email
        }
      }));
    } catch (err: any) {
      setResults(prev => ({ 
        ...prev, 
        authIdMapping: {
          success: false,
          error: err.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, authId: false }));
    }
  };

  // Check user_stats
  const checkUserStats = async () => {
    if (!userProfile?.local_id) {
      setError('No user profile found. Please login first.');
      return;
    }

    setLoading(prev => ({ ...prev, userStats: true }));
    try {
      // First check if stats exist
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userProfile.local_id)
        .single();

      const statsExist = !error && data;
      
      // Try to ensure stats exist
      const ensureResult = await ensureUserStatsExists(userProfile.local_id);
      
      // Check again after ensure
      const { data: dataAfter, error: errorAfter } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userProfile.local_id)
        .single();

      setResults(prev => ({ 
        ...prev, 
        userStats: {
          initiallyExists: statsExist,
          ensureResult,
          existsAfterEnsure: !errorAfter && dataAfter,
          stats: dataAfter || data || null
        }
      }));
    } catch (err: any) {
      setResults(prev => ({ 
        ...prev, 
        userStats: {
          success: false,
          error: err.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, userStats: false }));
    }
  };

  // Check recommendations
  const checkRecommendations = async () => {
    if (!user?.id) {
      setError('No user found. Please login first.');
      return;
    }

    setLoading(prev => ({ ...prev, recommendations: true }));
    try {
      const recommendations = await fetchRecommendations(user.id);
      
      setResults(prev => ({ 
        ...prev, 
        recommendations: {
          success: true,
          hasRecommendations: recommendations.wines.length > 0,
          wineCount: recommendations.wines.length,
          sampleWine: recommendations.wines[0] || null,
          lastUpdated: recommendations.lastUpdated
        }
      }));
    } catch (err: any) {
      setResults(prev => ({ 
        ...prev, 
        recommendations: {
          success: false,
          error: err.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  };

  // Run all tests
  const runAllTests = () => {
    checkAuthIdMapping();
    checkUserStats();
    checkRecommendations();
  };

  // Format JSON for display
  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Section>
        <DefaultText variant="heading2" className="mb-2">
          Admin Diagnostics
        </DefaultText>
        
        {error && (
          <Card className="bg-red-50 dark:bg-red-900 my-4">
            <DefaultText color="muted" className="text-red-700 dark:text-red-200">
              {error}
            </DefaultText>
          </Card>
        )}

        <Card className="my-6">
          <DefaultText variant="heading3" className="mb-4">
            Current User
          </DefaultText>
          
          <div className={`p-4 rounded-md ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DefaultText><strong>Auth ID:</strong> {user?.id || 'Not logged in'}</DefaultText>
              <DefaultText><strong>Email:</strong> {user?.email || 'N/A'}</DefaultText>
              <DefaultText><strong>Local ID:</strong> {userProfile?.local_id || 'N/A'}</DefaultText>
              <DefaultText><strong>Admin:</strong> {userProfile?.is_admin ? 'Yes' : 'No'}</DefaultText>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            onClick={runAllTests}
            variant="primary"
          >
            Run All Tests
          </Button>
          
          <Button
            onClick={checkAuthIdMapping}
            disabled={loading.authId}
            variant="secondary"
          >
            {loading.authId ? 'Checking...' : 'Test Auth ID Mapping'}
          </Button>
          
          <Button
            onClick={checkUserStats}
            disabled={loading.userStats}
            variant="secondary"
          >
            {loading.userStats ? 'Checking...' : 'Test User Stats'}
          </Button>
          
          <Button
            onClick={checkRecommendations}
            disabled={loading.recommendations}
            variant="secondary"
          >
            {loading.recommendations ? 'Checking...' : 'Test Recommendations'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Auth ID Mapping Results */}
          <Card bordered>
            <DefaultText variant="heading3" className="mb-4">
              Auth ID Mapping
            </DefaultText>
            {results.authIdMapping ? (
              <div>
                <div className={`inline-block px-2 py-1 text-xs rounded mb-3 ${
                  results.authIdMapping.success 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {results.authIdMapping.success ? 'SUCCESS' : 'FAILED'}
                </div>
                <pre className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-2 rounded text-xs overflow-auto max-h-60`}>
                  {formatJson(results.authIdMapping)}
                </pre>
              </div>
            ) : (
              <DefaultText color="muted">
                No data yet. Run the test.
              </DefaultText>
            )}
          </Card>
          
          {/* User Stats Results */}
          <Card bordered>
            <DefaultText variant="heading3" className="mb-4">
              User Stats
            </DefaultText>
            {results.userStats ? (
              <div>
                <div className={`inline-block px-2 py-1 text-xs rounded mb-3 ${
                  results.userStats.success === false 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : (results.userStats.initiallyExists 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200')
                }`}>
                  {results.userStats.success === false 
                    ? 'FAILED' 
                    : (results.userStats.initiallyExists ? 'EXISTS' : 'CREATED')}
                </div>
                <pre className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-2 rounded text-xs overflow-auto max-h-60`}>
                  {formatJson(results.userStats)}
                </pre>
              </div>
            ) : (
              <DefaultText color="muted">
                No data yet. Run the test.
              </DefaultText>
            )}
          </Card>
          
          {/* Recommendations Results */}
          <Card bordered>
            <DefaultText variant="heading3" className="mb-4">
              Recommendations
            </DefaultText>
            {results.recommendations ? (
              <div>
                <div className={`inline-block px-2 py-1 text-xs rounded mb-3 ${
                  !results.recommendations.success 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : (results.recommendations.hasRecommendations 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200')
                }`}>
                  {!results.recommendations.success 
                    ? 'ERROR' 
                    : (results.recommendations.hasRecommendations ? 'HAS RECOMMENDATIONS' : 'EMPTY BUT VALID')}
                </div>
                <pre className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-2 rounded text-xs overflow-auto max-h-60`}>
                  {formatJson(results.recommendations)}
                </pre>
              </div>
            ) : (
              <DefaultText color="muted">
                No data yet. Run the test.
              </DefaultText>
            )}
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default DiagnosticsTest;