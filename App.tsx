import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
// Garantir inicialização do Firebase (import side-effect apenas para debug/inicialização)
import './src/firebase/firebaseConfig';
import React, { useEffect } from 'react';
import syncPendingUsuarios from './src/firebase/syncPending';

export default function App() {
  useEffect(() => {
    // Tenta sincronizar registros locais pendentes ao iniciar o app
    syncPendingUsuarios();
  }, []);
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
