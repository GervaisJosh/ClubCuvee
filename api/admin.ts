import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';

// Inline error handling (no external dependencies)
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

const setCommonHeaders = (res: VercelResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};


// Inline admin utilities
const setUserAdminStatus = async (userId: string, isAdmin: boolean) => {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // Update the user profile
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ is_admin: isAdmin })
      .eq('local_id', userId) // Changed from 'id' to 'local_id'
      .select()
      .single();
    
    if (error) {
      return { 
        success: false, 
        error: `Failed to update admin status: ${error.message}` 
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    return {
      success: false,
      error: `An unexpected error occurred: ${error.message}`
    };
  }
};

const checkUserAdminStatus = async (authId: string) => {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('auth_id', authId) // Use auth_id to match the auth user
      .single();
    
    if (error) {
      return { 
        success: false, 
        isAdmin: false,
        error: `Failed to check admin status: ${error.message}` 
      };
    }
    
    return {
      success: true,
      isAdmin: !!data?.is_admin
    };
  } catch (error: any) {
    return {
      success: false,
      isAdmin: false,
      error: `An unexpected error occurred: ${error.message}`
    };
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Create Supabase admin client directly in the API (no external dependencies)
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

  try {
    setCommonHeaders(res);

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    // Check if the request has a valid auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing authentication token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }
    
    // Verify the JWT token and get the user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Check admin status
        const checkResult = await checkUserAdminStatus(user.id);
        return res.status(checkResult.success ? 200 : 400).json(checkResult);
        
      case 'POST':
        // Ensure only current admins can set admin status (except for the first admin)
        const { userId, isAdmin } = req.body;
        
        if (!userId || isAdmin === undefined) {
          return res.status(400).json({ error: 'Bad Request: Missing userId or isAdmin parameter' });
        }
        
        // Check if this is the first admin being created (check if any admin exists)
        const { data: existingAdmins } = await supabaseAdmin
          .from('users')
          .select('local_id') // Changed from 'id' to 'local_id'
          .eq('is_admin', true)
          .limit(1);
        
        const isFirstAdmin = existingAdmins?.length === 0;
        
        // Check if the requestor is an admin (unless this is the first admin being created)
        if (!isFirstAdmin) {
          const adminCheck = await checkUserAdminStatus(user.id);
          if (!adminCheck.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can modify admin status' });
          }
        }
        
        // Set the admin status
        const result = await setUserAdminStatus(userId, isAdmin);
        return res.status(result.success ? 200 : 400).json(result);
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Error in admin endpoint:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}