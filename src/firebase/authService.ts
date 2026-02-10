import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const authService = {
  // Registrar novo usuário
  async register(email: string, password: string) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Erro ao registrar' 
      };
    }
  },

  // Fazer login
  async login(email: string, password: string) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login' 
      };
    }
  },

  // ✅ REDEFINIR SENHA - Enviar email
  async sendPasswordReset(email: string) {
    try {
      await auth().sendPasswordResetEmail(email);
      return { 
        success: true, 
        message: 'Email de redefinição enviado com sucesso!' 
      };
    } catch (error: any) {
      let errorMessage = 'Erro ao enviar email de redefinição';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Fazer logout
  async logout() {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Obter usuário atual
  getCurrentUser() {
    return auth().currentUser;
  },

  // Ouvidor de estado de autenticação
  onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }
};