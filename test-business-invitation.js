const fetch = require('node-fetch');

// Test the business invitation endpoint
async function testBusinessInvitation() {
  try {
    console.log('Testing business invitation endpoint...');
    
    const response = await fetch('http://localhost:3000/api/generate-business-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-admin-token-here' // Replace with actual admin token
      },
      body: JSON.stringify({
        business_name: 'Test Restaurant',
        business_email: 'test@example.com',
        pricing_tier: null
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('Success! Generated invitation:', data);
    } else {
      console.error('Error response:', responseText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testBusinessInvitation();