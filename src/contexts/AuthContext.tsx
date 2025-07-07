import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import { loginUser, registerUser, logoutUser } from '../services/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const user = await registerUser(email, password, displayName);
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            console.error('User document not found');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};