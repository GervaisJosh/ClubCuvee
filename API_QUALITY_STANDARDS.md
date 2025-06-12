# Club Cuvée API Quality Standards & Development Process

## MANDATORY Pre-Completion Checklist

**🚨 CRITICAL: Before marking ANY API work as "complete", ALL of these steps MUST pass:**

### 1. TypeScript Compilation ✅ REQUIRED
```bash
npm run build:api
```
- **MUST succeed with zero errors**
- **MUST generate .js files for all modified APIs**
- **MUST not have TypeScript return type mismatches**

### 2. JavaScript Syntax Validation ✅ REQUIRED
```bash
# Verify each modified API file
node -c api/[modified-api].js
```
- **MUST pass syntax validation**
- **MUST verify all return statements use correct void pattern**

### 3. Build Output Verification ✅ REQUIRED
```bash
# Check that .js files exist and are recent
ls -la api/[modified-api].js
```
- **MUST have recent timestamp**
- **MUST be non-zero file size**

### 4. Production API Testing ✅ REQUIRED
```bash
# Test at least one endpoint
curl -X POST https://club-cuvee.vercel.app/api/[endpoint] \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' --connect-timeout 10
```
- **MUST return proper error messages (not 404/500 failures)**
- **MUST demonstrate API is deployed and accessible**

## Mandatory TypeScript Handler Pattern

### ✅ CORRECT Pattern (Required):
```typescript
const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    // API logic here
    
    if (someCondition) {
      res.status(400).json({ error: 'Validation failed' });
      return;
    }
    
    res.status(200).json({ success: true, data: result });
    return;
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
```

### ❌ WRONG Pattern (Will Fail Compilation):
```typescript
const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); // ❌ Returns VercelResponse
  }
  
  try {
    return res.status(200).json(result); // ❌ Returns VercelResponse
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' }); // ❌ Returns VercelResponse
  }
};
```

## Required Inline Dependencies Pattern

### ✅ CORRECT (Vercel Compatible):
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// INLINE Supabase client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// INLINE error handling
class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// ... rest of inline dependencies
```

### ❌ WRONG (Will Fail in Production):
```typescript
import { supabaseAdmin } from '../lib/supabaseAdmin'; // ❌ External import
import { withErrorHandling } from './utils/errorHandler'; // ❌ External import
```

## Database Schema Standards

### ✅ CORRECT Table References:
- `businesses` (not `restaurants`)
- `business_id` (not `restaurant_id`)
- `membership_tiers.business_id`
- `customers.business_id`

### ❌ WRONG (Legacy References):
- ❌ `restaurants` table
- ❌ `restaurant_id` column
- ❌ `membership_tiers.restaurant_id`

## Deployment Process

### 1. Development Phase:
```bash
# Make API changes following standards above
npm run build:api     # MUST pass
node -c api/file.js   # MUST pass
```

### 2. Testing Phase:
```bash
# Test locally if needed
npm run dev

# Test specific endpoint
curl -X POST http://localhost:3000/api/endpoint -H "Content-Type: application/json" -d '{}'
```

### 3. Production Deployment:
```bash
# Deploy (auto-deploys on push to main, or manual)
vercel --prod

# Verify deployment
curl -X POST https://club-cuvee.vercel.app/api/endpoint -H "Content-Type: application/json" -d '{}'
```

## Quality Gates Summary

**❌ If ANY of these fail, the work is NOT complete:**
1. `npm run build:api` fails
2. Generated .js files are missing
3. JavaScript syntax errors (`node -c` fails)
4. Production API returns 404/500 errors instead of proper responses
5. TypeScript return type mismatches
6. External import dependencies used
7. Wrong database table/column references

**✅ Success Criteria:**
1. TypeScript compiles without errors
2. All modified APIs have corresponding .js files
3. JavaScript syntax validation passes
4. Production endpoints return proper error messages
5. APIs use correct void return pattern
6. All dependencies are inlined
7. Database queries use correct schema

## Why These Standards Matter

1. **Silent Failures**: TypeScript errors prevent deployment without obvious error messages
2. **Production Reliability**: External imports fail in Vercel serverless environment
3. **Database Integrity**: Wrong table references cause 404s and data corruption
4. **Developer Experience**: Consistent patterns reduce debugging time
5. **Quality Assurance**: Automated validation prevents regression

---

**🎯 Remember: If it doesn't pass ALL validation steps, it's not done!**