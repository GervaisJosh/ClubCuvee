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
  const isSettingUpRef = useRef<boolean>(false)
  const lastRefreshTimeRef = useRef<number>(0)

  // Set up auto-refresh for session
  const setupAutoRefresh = (session: Session | null) => {
    // Prevent concurrent setup calls
    if (isSettingUpRef.current) {
      console.log('Setup already in progress, skipping...')
      return
    }

    // Clear any existing timer
    if (sessionRefreshTimerRef.current) {
      clearTimeout(sessionRefreshTimerRef.current)
      sessionRefreshTimerRef.current = null
    }

    if (!session?.expires_at) return

    isSettingUpRef.current = true

    try {
      // Calculate when to refresh (5 minutes before expiry)
      const expiresAt = new Date(session.expires_at).getTime()
      const now = Date.now()
      const refreshIn = expiresAt - now - 5 * 60 * 1000 // 5 minutes before expiry

      // Ensure minimum refresh interval of 1 minute
      const minRefreshInterval = 60 * 1000 // 1 minute
      const adjustedRefreshIn = Math.max(refreshIn, minRefreshInterval)

      if (adjustedRefreshIn > 0) {
        console.log(`Setting up session refresh in ${Math.round(adjustedRefreshIn / 1000 / 60)} minutes`)
        sessionRefreshTimerRef.current = setTimeout(() => {
          refreshSession()
        }, adjustedRefreshIn)
      } else {
        console.log('Session needs immediate refresh, but applying cooldown...')
        // Apply a small delay to prevent rapid refreshes
        setTimeout(() => {
          refreshSession()
        }, 5000) // 5 second delay
      }
    } finally {
      isSettingUpRef.current = false
    }
  }

  // Refresh session method
  const refreshSession = async (): Promise<Session | null> => {
    // Check cooldown to prevent rapid refreshes
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current
    const cooldownPeriod = 60 * 1000 // 60 seconds

    if (timeSinceLastRefresh < cooldownPeriod) {
      console.log(`Refresh cooldown active. Time since last refresh: ${Math.round(timeSinceLastRefresh / 1000)}s`)
      return null
    }

    // Prevent concurrent refreshes
    if (isRefreshing) {
      console.log('Refresh already in progress, skipping...')
      return null
    }

    try {
      setIsRefreshing(true)
      lastRefreshTimeRef.current = now
      console.log('Refreshing session...')
      
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        return null
      }
      
      if (session) {
        console.log('Session refreshed successfully')
        // Don't call setSession or setupAutoRefresh here - let onAuthStateChange handle it
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      
      // Update state
      setSession(session)
      setUser(session?.user ?? null)
      
      // Only setup auto-refresh for specific events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        setupAutoRefresh(session)
      }
      
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