import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { User, Session } from '@supabase/supabase-js'
import { getUserProfile } from '../api/supabaseQueries';
import { getUserProfileByAuthId } from '../services/userService';


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
      // Use the enhanced function that ensures a user profile exists
      const profile = await getUserProfileByAuthId(userId);
      setUserProfile(profile);
      
      // Set admin status from user profile
      // Explicitly convert to boolean to ensure consistent type
      if (profile) {
        setIsAdmin(profile.is_admin === true);
        
        // Log admin status for debugging
        if (profile.is_admin) {
          console.info('User has admin privileges');
        }
      } else {
        setIsAdmin(false);
        console.warn('No user profile found even after creation attempt');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
