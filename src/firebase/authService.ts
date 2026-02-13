import { auth } from './firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth';

export const authService = {
  // Login
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Registro
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Usuário atual
  getCurrentUser() {
    return auth.currentUser;
  },

  // Reset de senha
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Email de redefinição enviado com sucesso!' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Listener de autenticação
  onAuthStateChanged(callback: (user: any) => void) {
    return auth.onAuthStateChanged(callback);
  }
};