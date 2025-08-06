import React, { createContext, useState, useEffect, useContext, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export type UserType = 'admin' | 'business' | 'customer' | 'none';

interface UserProfile {
  id?: string;
  auth_id: string;
  email?: string;
  name?: string;
  is_admin?: boolean;
  is_business?: boolean;
  is_customer?: boolean;
  business_id?: string;
  customer_id?: string;
}

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  userType: UserType
  loading: boolean
  isAdmin: boolean
  isRefreshing: boolean
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
  refreshSession: () => Promise<Session | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userType, setUserType] = useState<UserType>('none')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const sessionRefreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Set up auto-refresh for session
  const setupAutoRefresh = (session: Session | null) => {
    // Clear any existing timer
    if (sessionRefreshTimerRef.current) {
      clearTimeout(sessionRefreshTimerRef.current)
      sessionRefreshTimerRef.current = null
    }

    if (!session?.expires_at) return

    // Calculate when to refresh (5 minutes before expiry)
    const expiresAt = new Date(session.expires_at).getTime()
    const now = Date.now()
    const refreshIn = expiresAt - now - 5 * 60 * 1000 // 5 minutes before expiry

    if (refreshIn > 0) {
      console.log(`Setting up session refresh in ${Math.round(refreshIn / 1000 / 60)} minutes`)
      sessionRefreshTimerRef.current = setTimeout(() => {
        refreshSession()
      }, refreshIn)
    } else {
      // Session is about to expire or already expired, refresh immediately
      refreshSession()
    }
  }

  // Refresh session method
  const refreshSession = async (): Promise<Session | null> => {
    try {
      setIsRefreshing(true)
      console.log('Refreshing session...')
      
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        return null
      }
      
      if (session) {
        console.log('Session refreshed successfully')
        setSession(session)
        setUser(session.user)
        setupAutoRefresh(session)
      }
      
      return session
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return null
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setupAutoRefresh(session)
      if (session?.user) {
        determineUserType(session.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setupAutoRefresh(session)
      if (session?.user) {
        determineUserType(session.user)
      } else {
        setUserProfile(null)
        setUserType('none')
        setIsAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (sessionRefreshTimerRef.current) {
        clearTimeout(sessionRefreshTimerRef.current)
      }
    }
  }, [])

  const determineUserType = async (authUser: User) => {
    try {
      // Log all metadata for debugging
      console.log('Determining user type for:', {
        email: authUser.email,
        id: authUser.id,
        app_metadata: authUser.app_metadata,
        user_metadata: authUser.user_metadata
      });

      // 1. Check admin first (highest priority) - using app_metadata
      if (authUser.app_metadata?.is_admin === true) {
        console.log('User is admin (from app_metadata)');
        setUserProfile({
          auth_id: authUser.id,
          email: authUser.email,
          is_admin: true
        });
        setUserType('admin');
        setIsAdmin(true);
        return;
      }

      // 2. CRITICAL: Check user_metadata role FIRST
      // If they have customer role in user_metadata, they ARE a customer regardless of other data
      if (authUser.user_metadata?.role === 'customer') {
        console.log('User is explicitly marked as customer in user_metadata');
        
        // Get customer record
        const { data: customerUser, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_id', authUser.id)
          .maybeSingle();
        
        if (customerUser && !customerError) {
          console.log('Found customer record:', customerUser.name);
          setUserProfile({
            id: customerUser.id,
            auth_id: authUser.id,
            email: customerUser.email,
            name: customerUser.name,
            is_customer: true,
            customer_id: customerUser.id
          });
          setUserType('customer');
          setIsAdmin(false);
          return;
        }
      }

      // 3. Check business owner
      const { data: businessUser, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', authUser.id)
        .maybeSingle();
      
      if (businessUser && !businessError) {
        console.log('User is a business owner:', businessUser.name);
        setUserProfile({
          id: businessUser.id,
          auth_id: authUser.id,
          email: businessUser.email,
          name: businessUser.name,
          is_business: true,
          business_id: businessUser.id
        });
        setUserType('business');
        setIsAdmin(false);
        return;
      }
      
      // 2b. Check business_users table for business admins
      const { data: businessUserRecord, error: businessUserError } = await supabase
        .from('business_users')
        .select(`
          *,
          businesses:business_id (*)
        `)
        .eq('auth_id', authUser.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (businessUserRecord && !businessUserError && businessUserRecord.businesses) {
        console.log('User is a business admin:', businessUserRecord.businesses.name);
        setUserProfile({
          id: businessUserRecord.businesses.id,
          auth_id: authUser.id,
          email: businessUserRecord.email || authUser.email,
          name: businessUserRecord.full_name || businessUserRecord.businesses.name,
          is_business: true,
          business_id: businessUserRecord.business_id
        });
        setUserType('business');
        setIsAdmin(false);
        return;
      }
      
      // 4. Check customer (moved after business checks)
      const { data: customerUser, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_id', authUser.id)
        .maybeSingle();
      
      if (customerUser && !customerError) {
        console.log('User is a customer:', customerUser.name);
        setUserProfile({
          id: customerUser.id,
          auth_id: authUser.id,
          email: customerUser.email,
          name: customerUser.name,
          is_customer: true,
          customer_id: customerUser.id
        });
        setUserType('customer');
        setIsAdmin(false);
        return;
      }
      
      // 5. No profile found
      console.log('User has no profile yet');
      setUserProfile({
        auth_id: authUser.id,
        email: authUser.email
      });
      setUserType('none');
      setIsAdmin(false);
      
    } catch (error) {
      console.error('Error determining user type:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      // Set basic profile even on error
      setUserProfile({
        auth_id: authUser.id,
        email: authUser.email
      });
      setUserType('none');
      setIsAdmin(false);
    }
  }

  const signOut = async () => {
    // Clear refresh timer
    if (sessionRefreshTimerRef.current) {
      clearTimeout(sessionRefreshTimerRef.current)
      sessionRefreshTimerRef.current = null
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    setUserProfile(null)
    setUserType('none')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userProfile, 
      userType,
      loading,
      isAdmin,
      isRefreshing,
      setUser, 
      signOut,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}