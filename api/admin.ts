import { VercelRequest, VercelResponse } from '@vercel/node';
import { setUserAdminStatus, checkUserAdminStatus } from './utils/adminUtils';
import { supabaseAdmin } from './utils/supabaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check if the request has a valid auth token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing authentication token' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
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