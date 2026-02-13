import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../firebase/authService';

interface AuthContextData {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega usuário do AsyncStorage (persistência)
    const loadStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('@app:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadStoredUser();

    // Listener do Firebase
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem('@app:user', JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('@app:user');
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.success) {
      setUser(response.user);
      await AsyncStorage.setItem('@app:user', JSON.stringify(response.user));
    }
    return response;
  };

  const signUp = async (email: string, password: string) => {
    const response = await authService.register(email, password);
    if (response.success) {
      setUser(response.user);
      await AsyncStorage.setItem('@app:user', JSON.stringify(response.user));
    }
    return response;
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
    await AsyncStorage.removeItem('@app:user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);