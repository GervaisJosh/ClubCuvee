#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🍷 Club Cuvée Setup Script');
console.log('===========================');
console.log('');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📄 Creating .env file from .env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Edit the .env file and add your API keys');
    console.log('2. Set up your Supabase project and database');
    console.log('3. Configure your Stripe account and webhooks');
    console.log('4. Run `npm run dev` to start the development server');
  } else {
    console.log('❌ .env.example file not found');
    console.log('Please ensure you are running this from the project root directory');
  }
} else {
  console.log('📄 .env file already exists');
}

console.log('');
console.log('🔧 Required Setup Steps:');
console.log('');

console.log('📊 1. Supabase Setup:');
console.log('   - Create a new project at https://supabase.com');
console.log('   - Copy your project URL and anon key to .env');
console.log('   - Run the database migrations in the SQL editor');
console.log('   - Create a service role key for server-side operations');
console.log('');

console.log('💳 2. Stripe Setup:');
console.log('   - Create a Stripe account at https://stripe.com');
console.log('   - Copy your test API keys to .env');
console.log('   - Create products and prices for business subscription tiers');
console.log('   - Set up a webhook endpoint pointing to /api/webhook/stripe');
console.log('   - Add webhook secret to .env');
console.log('');

console.log('🚀 3. Deployment (Optional):');
console.log('   - Deploy to Vercel: https://vercel.com');
console.log('   - Configure environment variables in Vercel dashboard');
console.log('   - Update Stripe webhook URL to production domain');
console.log('   - Test the complete onboarding flow');
console.log('');

console.log('🧪 4. Testing:');
console.log('   - Run `node tests/api-endpoints.test.js` to test API endpoints');
console.log('   - Environment validation runs automatically in development');
console.log('   - Use Stripe test cards for testing payments');
console.log('');

console.log('📚 For detailed documentation, see:');
console.log('   - README.md');
console.log('   - ONBOARDING_SYSTEM_CHANGELOG.md');
console.log('   - .env.example for environment variable descriptions');
console.log('');

console.log('🎉 Setup complete! Run `npm run dev` to start developing.');
console.log('===========================');