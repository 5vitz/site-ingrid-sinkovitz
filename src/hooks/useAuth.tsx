import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user?.email) {
        try {
          if (['sinkando@gmail.com', 'ingridsinkovitz@gmail.com'].includes(user.email)) {
            setRole('super');
          } else {
            const roleDoc = await getDoc(doc(db, 'users_roles', user.email));
            if (roleDoc.exists()) {
              setRole(roleDoc.data().role as UserRole);
            } else {
              setRole(null);
            }
          }
        } catch (err) {
          console.error("Error fetching role:", err);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
      setAuthActionLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (authActionLoading) return;
    setAuthActionLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setAuthActionLoading(false);
      console.error("Login failed", error);
      if (error.code === 'auth/popup-blocked') {
        alert('O navegador bloqueou a janela de login. Por favor, habilite popups para este site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Just user closing the popup or navigating away, ignore
      } else {
        alert('Ocorreu um erro ao tentar entrar. Tente novamente.');
      }
    }
  };

  const logout = async () => {
    setAuthActionLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      setAuthActionLoading(false);
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading: loading || authActionLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
