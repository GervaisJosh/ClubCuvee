import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserType = 'admin' | 'business' | 'customer' | 'none';

interface UserTypeResult {
  userType: UserType;
  metadata: {
    businessId?: string;
    customerId?: string;
    tierId?: string;
    name?: string;
    email?: string;
  };
  source: 'metadata' | 'database' | 'none';
  confidence: 'high' | 'medium' | 'low';
}

interface CacheEntry {
  result: UserTypeResult;
  timestamp: number;
}

/**
 * UserTypeService - Centralized service for determining user types
 * 
 * This service provides a single source of truth for user type determination,
 * with caching, fallback logic, and comprehensive error handling.
 */
class UserTypeService {
  private static instance: UserTypeService;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  private constructor() {}
  
  static getInstance(): UserTypeService {
    if (!UserTypeService.instance) {
      UserTypeService.instance = new UserTypeService();
    }
    return UserTypeService.instance;
  }
  
  /**
   * Clear the cache for a specific user or all users
   */
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
      console.log(`[UserTypeService] Cache cleared for user ${userId}`);
    } else {
      this.cache.clear();
      console.log('[UserTypeService] All cache cleared');
    }
  }
  
  /**
   * Determine the user type with comprehensive fallback logic
   */
  async determineUserType(user: User | null): Promise<UserTypeResult> {
    // No user = no type
    if (!user) {
      return {
        userType: 'none',
        metadata: {},
        source: 'none',
        confidence: 'high'
      };
    }
    
    // Check cache first
    const cached = this.getCachedResult(user.id);
    if (cached) {
      console.log(`[UserTypeService] Cache hit for user ${user.id}: ${cached.userType}`);
      return cached;
    }
    
    console.log(`[UserTypeService] Determining type for user ${user.id} (${user.email})`);
    
    // Start with metadata check (fastest and most reliable)
    const metadataResult = this.checkUserMetadata(user);
    if (metadataResult.confidence === 'high') {
      this.cacheResult(user.id, metadataResult);
      return metadataResult;
    }
    
    // Fallback to database check
    const databaseResult = await this.checkDatabase(user);
    if (databaseResult.confidence !== 'low') {
      // Update user metadata if we found them in database but metadata was missing
      if (databaseResult.userType !== 'none' && metadataResult.confidence === 'low') {
        await this.updateUserMetadata(user.id, databaseResult);
      }
      this.cacheResult(user.id, databaseResult);
      return databaseResult;
    }
    
    // Final fallback - use whatever we found
    const finalResult = metadataResult.confidence !== 'low' ? metadataResult : databaseResult;
    this.cacheResult(user.id, finalResult);
    return finalResult;
  }
  
  /**
   * Check user metadata for type determination
   */
  private checkUserMetadata(user: User): UserTypeResult {
    const userMetadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};
    
    console.log(`[UserTypeService] Checking metadata for ${user.email}:`, {
      user_metadata: userMetadata,
      app_metadata: appMetadata
    });
    
    // PRIORITY 1: Check user_metadata.role (most specific)
    if (userMetadata.role === 'customer' || userMetadata.user_type === 'customer') {
      return {
        userType: 'customer',
        metadata: {
          businessId: userMetadata.business_id,
          tierId: userMetadata.tier_id,
          name: userMetadata.name || user.email?.split('@')[0],
          email: user.email
        },
        source: 'metadata',
        confidence: 'high'
      };
    }
    
    // PRIORITY 2: Check for business role
    if (userMetadata.role === 'business' || userMetadata.user_type === 'business') {
      return {
        userType: 'business',
        metadata: {
          businessId: userMetadata.business_id,
          name: userMetadata.name || user.email?.split('@')[0],
          email: user.email
        },
        source: 'metadata',
        confidence: 'high'
      };
    }
    
    // PRIORITY 3: Check for admin (app_metadata)
    if (appMetadata.is_admin === true) {
      return {
        userType: 'admin',
        metadata: {
          name: userMetadata.name || user.email?.split('@')[0],
          email: user.email
        },
        source: 'metadata',
        confidence: 'high'
      };
    }
    
    // No clear metadata
    return {
      userType: 'none',
      metadata: { email: user.email },
      source: 'metadata',
      confidence: 'low'
    };
  }
  
  /**
   * Check database for user type (fallback when metadata is missing)
   */
  private async checkDatabase(user: User): Promise<UserTypeResult> {
    console.log(`[UserTypeService] Checking database for user ${user.id}`);
    
    try {
      // Check if user is a business owner
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (business && !businessError) {
        console.log(`[UserTypeService] Found business owner: ${business.name}`);
        return {
          userType: 'business',
          metadata: {
            businessId: business.id,
            name: business.name,
            email: user.email
          },
          source: 'database',
          confidence: 'high'
        };
      }
      
      // Check business_users table
      const { data: businessUser, error: businessUserError } = await supabase
        .from('business_users')
        .select('business_id, full_name, role, businesses!inner(id, name)')
        .eq('auth_id', user.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (businessUser && !businessUserError) {
        console.log(`[UserTypeService] Found business user: ${businessUser.full_name}`);
        return {
          userType: 'business',
          metadata: {
            businessId: businessUser.business_id,
            name: businessUser.full_name,
            email: user.email
          },
          source: 'database',
          confidence: 'high'
        };
      }
      
      // Check if user is a customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id, name, business_id, tier_id')
        .eq('auth_id', user.id)
        .maybeSingle();
      
      if (customer && !customerError) {
        console.log(`[UserTypeService] Found customer: ${customer.name}`);
        return {
          userType: 'customer',
          metadata: {
            customerId: customer.id,
            businessId: customer.business_id,
            tierId: customer.tier_id,
            name: customer.name,
            email: user.email
          },
          source: 'database',
          confidence: 'high'
        };
      }
      
      // No profile found
      console.log(`[UserTypeService] No profile found for user ${user.id}`);
      return {
        userType: 'none',
        metadata: { email: user.email },
        source: 'database',
        confidence: 'medium'
      };
      
    } catch (error) {
      console.error('[UserTypeService] Database check error:', error);
      return {
        userType: 'none',
        metadata: { email: user.email },
        source: 'database',
        confidence: 'low'
      };
    }
  }
  
  /**
   * Update user metadata based on database findings
   */
  private async updateUserMetadata(userId: string, result: UserTypeResult): Promise<void> {
    if (result.userType === 'none') return;
    
    console.log(`[UserTypeService] Updating metadata for user ${userId} to ${result.userType}`);
    
    try {
      const updates: any = {
        role: result.userType,
        user_type: result.userType,
        updated_by: 'UserTypeService',
        updated_at: new Date().toISOString()
      };
      
      if (result.metadata.businessId) {
        updates.business_id = result.metadata.businessId;
      }
      if (result.metadata.customerId) {
        updates.customer_id = result.metadata.customerId;
      }
      if (result.metadata.tierId) {
        updates.tier_id = result.metadata.tierId;
      }
      if (result.metadata.name) {
        updates.name = result.metadata.name;
      }
      
      // Note: This requires service role key to update auth.users
      // In production, this should be done via an API endpoint
      console.log('[UserTypeService] Metadata update queued (requires API call):', updates);
      
    } catch (error) {
      console.error('[UserTypeService] Failed to update metadata:', error);
    }
  }
  
  /**
   * Get cached result if available and not expired
   */
  private getCachedResult(userId: string): UserTypeResult | null {
    const cached = this.cache.get(userId);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL) {
      this.cache.delete(userId);
      return null;
    }
    
    return cached.result;
  }
  
  /**
   * Cache a result
   */
  private cacheResult(userId: string, result: UserTypeResult): void {
    this.cache.set(userId, {
      result,
      timestamp: Date.now()
    });
  }
  
  /**
   * Validate that a user has the expected type
   */
  async validateUserType(user: User, expectedType: UserType): Promise<boolean> {
    const result = await this.determineUserType(user);
    return result.userType === expectedType;
  }
  
  /**
   * Get detailed user information
   */
  async getUserDetails(user: User): Promise<UserTypeResult> {
    return this.determineUserType(user);
  }
}

// Export singleton instance
export const userTypeService = UserTypeService.getInstance();

// Export convenience function
export async function determineUserType(user: User | null): Promise<UserType> {
  const result = await userTypeService.determineUserType(user);
  return result.userType;
}

// Export validation function
export async function validateUserAccess(
  user: User | null, 
  allowedTypes: UserType[]
): Promise<boolean> {
  if (!user) return false;
  const result = await userTypeService.determineUserType(user);
  return allowedTypes.includes(result.userType);
}