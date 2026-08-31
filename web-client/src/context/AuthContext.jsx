import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const currentUser = await dbService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    // Listen to Supabase Auth state changes in real-time
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const freshUser = await dbService.getCurrentUser();
            setUser(freshUser);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await dbService.signIn(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, country = '') => {
    setLoading(true);
    try {
      const registeredUser = await dbService.signUp(email, password, fullName, country);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const adminUser = await dbService.signInAdmin(email, password);
      setUser(adminUser);
      return adminUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (email, password, fullName, country = '', adminPasskey = '') => {
    setLoading(true);
    try {
      const newAdmin = await dbService.signUpAdmin(email, password, fullName, country, adminPasskey);
      setUser(newAdmin);
      return newAdmin;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await dbService.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (fullName, avatarUrl) => {
    try {
      const updatedUser = await dbService.updateUserProfile(fullName, avatarUrl);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Profile update failed:", err);
      throw err;
    }
  };

  const refreshUser = async () => {
    const currentUser = await dbService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const verifyAdminPasskey = async (secretKey) => {
    await dbService.verifyAdminKey(secretKey);
    await refreshUser();
    return true;
  };

  const isAdmin = !!(user && (user.is_admin || user.role === 'admin' || user.email === 'admin@slapbible.org'));

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginAdmin,
      registerAdmin,
      logout,
      updateProfile,
      refreshUser,
      verifyAdminPasskey,
      isAuthenticated: !!user,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
