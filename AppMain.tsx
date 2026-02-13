import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AppRoutes from './src/routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
