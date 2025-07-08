import React, { createContext, useState, useEffect, useContext } from 'react'
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
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userType, setUserType] = useState<UserType>('none')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        determineUserType(session.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        determineUserType(session.user)
      } else {
        setUserProfile(null)
        setUserType('none')
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const determineUserType = async (authUser: User) => {
    try {
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

      // 2. Check business owner
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
      
      // 3. Check customer
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
      
      // 4. No profile found
      console.log('User has no profile yet');
      setUserProfile({
        auth_id: authUser.id,
        email: authUser.email
      });
      setUserType('none');
      setIsAdmin(false);
      
    } catch (error) {
      console.error('Error determining user type:', error);
      setUserProfile(null);
      setUserType('none');
      setIsAdmin(false);
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
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
      setUser, 
      signOut 
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