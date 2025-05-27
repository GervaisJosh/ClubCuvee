interface EnvironmentConfig {
  name: string;
  required: boolean;
  description: string;
}

// Only include frontend-accessible (VITE_) environment variables
const FRONTEND_ENVIRONMENT_VARIABLES: Record<string, EnvironmentConfig> = {
  // Supabase - Required for database functionality
  VITE_SUPABASE_URL: {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL for database connections'
  },
  VITE_SUPABASE_ANON_KEY: {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key for client-side database access'
  },

  // Stripe - Required for payment processing
  VITE_STRIPE_PUBLIC_KEY: {
    name: 'VITE_STRIPE_PUBLIC_KEY',
    required: true,
    description: 'Stripe publishable key for client-side payment processing'
  },

  // Application Configuration
  VITE_APP_URL: {
    name: 'VITE_APP_URL',
    required: false,
    description: 'Application base URL (defaults to http://localhost:3000)'
  }
};

interface ValidationResult {
  isValid: boolean;
  missingRequired: string[];
  missingOptional: string[];
  warnings: string[];
  errors: string[];
}

export function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    missingRequired: [],
    missingOptional: [],
    warnings: [],
    errors: []
  };

  // Check each frontend environment variable using import.meta.env
  Object.entries(FRONTEND_ENVIRONMENT_VARIABLES).forEach(([key, config]) => {
    const value = import.meta.env[key];
    
    if (!value) {
      if (config.required) {
        result.missingRequired.push(key);
        result.errors.push(`Missing required environment variable: ${key} - ${config.description}`);
      } else {
        result.missingOptional.push(key);
        result.warnings.push(`Missing optional environment variable: ${key} - ${config.description}`);
      }
    } else {
      // Validate format for specific variables
      if (key === 'VITE_SUPABASE_URL' && !value.startsWith('https://')) {
        result.errors.push('VITE_SUPABASE_URL must be a valid HTTPS URL');
      }
      
      if (key === 'VITE_STRIPE_PUBLIC_KEY' && !value.startsWith('pk_')) {
        result.errors.push('VITE_STRIPE_PUBLIC_KEY must start with "pk_"');
      }
    }
  });

  // Set overall validity
  result.isValid = result.missingRequired.length === 0 && result.errors.length === 0;

  return result;
}

export function printEnvironmentReport(): void {
  const result = validateEnvironment();
  
  console.log('\n🔧 Environment Configuration Report');
  console.log('=====================================');
  
  if (result.isValid) {
    console.log('✅ All required environment variables are configured correctly!');
  } else {
    console.log('❌ Environment configuration issues detected:');
  }
  
  if (result.errors.length > 0) {
    console.log('\n🚨 Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings (optional features):');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (result.missingRequired.length > 0) {
    console.log('\n📋 Setup Instructions:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Fill in the following required variables:');
    result.missingRequired.forEach(variable => {
      const config = FRONTEND_ENVIRONMENT_VARIABLES[variable];
      console.log(`   - ${variable}: ${config.description}`);
    });
  }
  
  console.log('\n📚 For detailed setup instructions, see README.md');
  console.log('=====================================\n');
}

// Auto-run validation in development
if (import.meta.env?.DEV) {
  const result = validateEnvironment();
  if (!result.isValid) {
    printEnvironmentReport();
  }
}