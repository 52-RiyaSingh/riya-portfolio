import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';
import { ADMIN_EMAIL } from '../constants/initialData';
import { isAdminEmail } from '../utils/portfolioLogic';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthorizedAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!isAdminEmail(user.email, user.emailVerified)) {
        setAuthError(
          `Signed in as ${user.email || 'guest'}, but admin access is strictly restricted to ${ADMIN_EMAIL}.`
        );
      }
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to sign in with Google.';
      setAuthError(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (err: unknown) {
      console.error('Logout Error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const isAuthorizedAdmin = !!(currentUser && isAdminEmail(currentUser.email, currentUser.emailVerified));

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin: isAuthorizedAdmin,
        isAuthorizedAdmin,
        loginWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
