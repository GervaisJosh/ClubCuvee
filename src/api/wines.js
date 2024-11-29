import { supabase } from '../supabase';
export const getWines = async () => {
    try {
        const { data, error } = await supabase
            .from('wine_inventory')
            .select('*');
        if (error) {
            console.error('Error fetching wines:', error);
            return [];
        }
        return data || [];
    }
    catch (err) {
        console.error('Unexpected error in getWines:', err);
        return [];
    }
};
export const addWine = async (wine) => {
    try {
        const { data, error } = await supabase
            .from('wine_inventory')
            .insert(wine)
            .single();
        if (error) {
            console.error('Error adding wine:', error);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('Unexpected error in addWine:', err);
        return null;
    }
};
export const updateWine = async (id, wine) => {
    try {
        const { data, error } = await supabase
            .from('wine_inventory')
            .update(wine)
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error updating wine:', error);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('Unexpected error in updateWine:', err);
        return null;
    }
};
export const deleteWine = async (id) => {
    try {
        const { error } = await supabase
            .from('wine_inventory')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting wine:', error);
            return false;
        }
        return true;
    }
    catch (err) {
        console.error('Unexpected error in deleteWine:', err);
        return false;
    }
};
export const addWineRating = async (rating) => {
    try {
        const { data, error } = await supabase
            .from('wine_ratings_reviews')
            .insert(rating)
            .single();
        if (error) {
            console.error('Error adding wine rating:', error);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('Unexpected error in addWineRating:', err);
        return null;
    }
};
export const getWineRatings = async (wineId) => {
    try {
        const { data, error } = await supabase
            .from('wine_ratings_reviews')
            .select('*')
            .eq('wine_id', wineId);
        if (error) {
            console.error('Error fetching wine ratings:', error);
            return [];
        }
        return data || [];
    }
    catch (err) {
        console.error('Unexpected error in getWineRatings:', err);
        return [];
    }
};
