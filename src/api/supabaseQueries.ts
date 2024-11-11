import { supabase } from '../supabase'
import { createUser, getUserProfile } from './users'

export const signUp = async (email: string, password: string, username: string, accountType: string, restaurantName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        account_type: accountType,
        restaurant_name: restaurantName,
      },
    },
  })
  if (error) throw error

  if (data.user) {
    const existingProfile = await getUserProfile(data.user.id)
    if (!existingProfile) {
      await createUser({
        id: data.user.id,
        email: data.user.email!,
        wine_tier: 1,
        first_name: username,
        last_name: '',
        preferences: {},
      })
    }
  }

  return data
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return { user: data.user, error: null }
  } catch (error: any) {
    console.error('SignIn error:', error)
    return { user: null, error }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return { data };
  } catch (err) {
    console.error('Detailed Google Sign-In Error:', err);
    throw err;
  }
}

export const resendConfirmationEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })
  if (error) throw error
  return data
}

export { getUserProfile } from './users'

export const fetchWines = async () => {
  const { data, error } = await supabase
    .from('wine_inventory')
    .select('*')
  if (error) throw error
  return data
}

export const addWineRating = async (ratingData) => {
  const { data, error } = await supabase
    .from('wine_ratings_reviews')
    .insert(ratingData)
  if (error) throw error
  return data
}

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
  if (error) throw error
  return data
}

export const createEvent = async (eventData) => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
  if (error) throw error
  return data
}

export const updateEvent = async (id, updates) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
  if (error) throw error
  return data
}

export const deleteEvent = async (id) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  if (error) throw error
}