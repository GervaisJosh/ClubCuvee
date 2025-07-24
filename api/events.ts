import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export interface Event {
  id: string;
  event_name: string;
  description: string;
  date: string;
  venue: string;
  attendees: string[];
  created_at: string;
}

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data || []
}

export const createEvent = async (eventData: Omit<Event, 'id' | 'created_at'>): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return null
  }

  return data
}

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error updating event:', error)
    return null
  }

  return data
}

export const deleteEvent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting event:', error)
    return false
  }

  return true
}