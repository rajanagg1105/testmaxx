import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

interface UserPreferences {
  selectedClass?: 6 | 7 | 8 | null;
  hasCompletedOnboarding?: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const preferencesDoc = await getDoc(doc(db, 'userPreferences', currentUser.uid));
        
        if (preferencesDoc.exists()) {
          setPreferences(preferencesDoc.data() as UserPreferences);
        } else {
          // Create default preferences document
          const defaultPreferences: UserPreferences = {
            hasCompletedOnboarding: false
          };
          await setDoc(doc(db, 'userPreferences', currentUser.uid), defaultPreferences);
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [currentUser]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!currentUser) return;

    try {
      const newPreferences = { ...preferences, ...updates };
      
      // Check if document exists
      const preferencesDoc = await getDoc(doc(db, 'userPreferences', currentUser.uid));
      
      if (preferencesDoc.exists()) {
        await updateDoc(doc(db, 'userPreferences', currentUser.uid), updates);
      } else {
        await setDoc(doc(db, 'userPreferences', currentUser.uid), newPreferences);
      }
      
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  };

  const value = {
    preferences,
    updatePreferences,
    loading
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};