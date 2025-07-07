import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { User, Session } from '@supabase/supabase-js'


interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: any | null
  isAdmin: boolean
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // First, check if this is a business user by looking in the businesses table
      const { data: businessUser, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userId)
        .single();
      
      if (businessUser && !businessError) {
        // This is a business user - use business data as profile
        console.log('User is a business owner:', businessUser.name);
        setUserProfile({
          id: businessUser.id,
          auth_id: userId,
          email: businessUser.email,
          name: businessUser.name,
          is_business: true,
          business_id: businessUser.id,
          is_admin: false // Business users are not system admins
        });
        setIsAdmin(false);
        return;
      }
      
      // Check if this is a customer
      const { data: customerUser, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_id', userId)
        .single();
      
      if (customerUser && !customerError) {
        // This is a customer user
        console.log('User is a customer:', customerUser.name);
        setUserProfile({
          id: customerUser.id,
          auth_id: userId,
          email: customerUser.email,
          name: customerUser.name,
          is_customer: true,
          customer_id: customerUser.id,
          is_admin: false
        });
        setIsAdmin(false);
        return;
      }
      
      // If not found in businesses or customers, it might be a system admin
      // For now, just set a minimal profile
      console.log('User not found in businesses or customers tables');
      setUserProfile({
        auth_id: userId,
        is_admin: false
      });
      setIsAdmin(false);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
      setIsAdmin(false);
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setUserProfile(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, session, userProfile, isAdmin, setUser, signOut }}>
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
