import { supabase } from '../supabase';
export const getEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*');
    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    return data || [];
};
export const createEvent = async (eventData) => {
    const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .single();
    if (error) {
        console.error('Error creating event:', error);
        return null;
    }
    return data;
};
export const updateEvent = async (id, updates) => {
    const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error updating event:', error);
        return null;
    }
    return data;
};
export const deleteEvent = async (id) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting event:', error);
        return false;
    }
    return true;
};
