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

    // Listen for cross-component auth session updates
    const handleAuthEvent = async () => {
      await checkUser();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('slap_auth_updated', handleAuthEvent);
    }

    // Listen to Supabase Auth state changes in real-time
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const authSub = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const freshUser = await dbService.getCurrentUser();
            setUser(freshUser);
          }
        } else if (event === 'SIGNED_OUT') {
          // Only clear user state if the persistent local session was also removed
          const localStored = typeof window !== 'undefined' ? localStorage.getItem('slap_current_user') : null;
          if (!localStored) {
            setUser(null);
          }
        }
      });
      subscription = authSub?.data?.subscription;
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('slap_auth_updated', handleAuthEvent);
      }
      subscription?.unsubscribe();
    };
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

  const requestPasswordReset = async (email) => {
    return await dbService.requestPasswordReset(email);
  };

  const updateUserPassword = async (newPassword) => {
    const updated = await dbService.updateUserPassword(newPassword);
    await checkUser();
    return updated;
  };

  const resetLocalUserPassword = async (email, newPassword) => {
    const updated = await dbService.resetLocalUserPassword(email, newPassword);
    setUser(updated);
    return updated;
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    const res = await dbService.changeAdminPassword(currentPassword, newPassword);
    await checkUser();
    return res;
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
      requestPasswordReset,
      updateUserPassword,
      resetLocalUserPassword,
      changeAdminPassword,
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
    return {
      user: null,
      loading: false,
      login: async () => { },
      register: async () => { },
      loginAdmin: async () => { },
      registerAdmin: async () => { },
      logout: async () => { },
      updateProfile: async () => { },
      refreshUser: async () => { },
      verifyAdminPasskey: async () => { },
      requestPasswordReset: async () => { },
      updateUserPassword: async () => { },
      resetLocalUserPassword: async () => { },
      changeAdminPassword: async () => { },
      isAuthenticated: false,
      isAdmin: false
    };
  }
  return context;
};
