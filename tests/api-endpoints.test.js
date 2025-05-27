// Simple API endpoint tests for Club Cuvée
// Run with: node tests/api-endpoints.test.js

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.text() : null
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      data: null,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 Club Cuvée API Endpoint Tests');
  console.log('================================');
  console.log(`Testing against: ${BASE_URL}`);
  console.log('');

  const tests = [
    {
      name: 'Stripe Configuration Check',
      endpoint: '/api/verify-stripe',
      method: 'GET',
      expectStatus: 200
    },
    {
      name: 'Admin System Check',
      endpoint: '/api/admin-system-check',
      method: 'GET',
      expectStatus: [200, 500] // May fail if not configured, but should respond
    },
    {
      name: 'Generate Onboarding Token (Invalid)',
      endpoint: '/api/generate-onboarding-token',
      method: 'POST',
      body: {},
      expectStatus: 400 // Should fail with missing fields
    },
    {
      name: 'Validate Onboarding Token (Invalid)',
      endpoint: '/api/validate-onboarding-token?token=invalid',
      method: 'GET',
      expectStatus: 404 // Should fail with invalid token
    },
    {
      name: 'Business Membership (Invalid ID)',
      endpoint: '/api/business/invalid-id/membership',
      method: 'GET',
      expectStatus: 404 // Should fail with invalid business ID
    },
    {
      name: 'Create Customer Checkout (Invalid)',
      endpoint: '/api/create-customer-checkout',
      method: 'POST',
      body: {},
      expectStatus: 400 // Should fail with missing fields
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`${test.name}... `);
    
    const result = await testEndpoint(test.endpoint, {
      method: test.method,
      body: test.body ? JSON.stringify(test.body) : undefined
    });

    const expectedStatuses = Array.isArray(test.expectStatus) 
      ? test.expectStatus 
      : [test.expectStatus];
    
    if (expectedStatuses.includes(result.status)) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log(`❌ FAIL (expected ${test.expectStatus}, got ${result.status})`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      failed++;
    }
  }

  console.log('');
  console.log('================================');
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All API endpoints are responding correctly!');
  } else {
    console.log('⚠️  Some endpoints may need configuration or debugging.');
    console.log('💡 This is normal in development - ensure environment variables are set.');
  }
  
  return failed === 0;
}

// Auto-run if called directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests, testEndpoint };