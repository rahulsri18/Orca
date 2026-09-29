import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentAuthSession,
  setAuthSession,
  authenticateUser,
  registerNewUser,
  getAllUsers,
  updateUserProfile,
  verifyUserCredential,
  deleteUserRecord,
  getAdminSummaryStats
} from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentAuthSession());
  const [allUsers, setAllUsers] = useState(() => getAllUsers());
  const [stats, setStats] = useState(() => getAdminSummaryStats());

  useEffect(() => {
    const handleAuthChange = (e) => {
      setCurrentUser(e.detail || null);
    };

    const handleUsersChange = (e) => {
      setAllUsers(e.detail || getAllUsers());
      setStats(getAdminSummaryStats());
    };

    window.addEventListener('orca_auth_changed', handleAuthChange);
    window.addEventListener('orca_users_updated', handleUsersChange);

    return () => {
      window.removeEventListener('orca_auth_changed', handleAuthChange);
      window.removeEventListener('orca_users_updated', handleUsersChange);
    };
  }, []);

  const login = (identifier, password) => {
    const result = authenticateUser(identifier, password);
    if (result.success) {
      setCurrentUser(result.user);
      setAllUsers(getAllUsers());
      setStats(getAdminSummaryStats());
    }
    return result;
  };

  const register = (formData) => {
    const result = registerNewUser(formData);
    if (result.success) {
      setCurrentUser(result.user);
      setAllUsers(getAllUsers());
      setStats(getAdminSummaryStats());
    }
    return result;
  };

  const logout = () => {
    setAuthSession(null);
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return false;
    const success = updateUserProfile(currentUser.id, updates);
    if (success) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
      setAllUsers(getAllUsers());
    }
    return success;
  };

  const verifyUser = (userId, isVerified = true) => {
    const ok = verifyUserCredential(userId, isVerified);
    if (ok) {
      setAllUsers(getAllUsers());
      setStats(getAdminSummaryStats());
    }
    return ok;
  };

  const deleteUser = (userId) => {
    const ok = deleteUserRecord(userId);
    if (ok) {
      setAllUsers(getAllUsers());
      setStats(getAdminSummaryStats());
    }
    return ok;
  };

  const refreshRegistry = () => {
    setAllUsers(getAllUsers());
    setStats(getAdminSummaryStats());
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    allUsers,
    stats,
    login,
    register,
    logout,
    updateProfile,
    verifyUser,
    deleteUser,
    refreshRegistry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
