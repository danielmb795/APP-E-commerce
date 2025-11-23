import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@Auth:user');
      const storagedToken = await AsyncStorage.getItem('@Auth:token');

      if (storagedUser && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email, password) {
    const response = await api.post('/auth/signin', {
      email,
      password,
    });

    const { token, user } = response.data;

    setUser(user);

    api.defaults.headers.Authorization = `Bearer ${token}`;

    await AsyncStorage.setItem('@Auth:user', JSON.stringify(user));
    await AsyncStorage.setItem('@Auth:token', token);
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }


  async function updateUserProfile(updates) {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  }

  return (

    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, updateUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}