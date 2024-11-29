import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { getUserProfile } from '../api/supabaseQueries';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
            else {
                setUserProfile(null);
            }
        });
        return () => subscription.unsubscribe();
    }, []);
    const fetchUserProfile = async (userId) => {
        try {
            const profile = await getUserProfile(userId);
            setUserProfile(profile);
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error)
            throw error;
        setUser(null);
        setUserProfile(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, session, userProfile, setUser, signOut }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
