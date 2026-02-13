// Usando Firebase nativo para React Native
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Suas credenciais direto
const firebaseConfig = {
  apiKey: "AIzaSyBz0uWpqsqmxUYNW_RcKa0EUWJwxyuY",
  authDomain: "crudreactnative-1b7bc.firebaseapp.com",
  projectId: "crudreactnative-1b7bc",
  storageBucket: "crudreactnative-1b7bc.firebasestorage.app",
  messagingSenderId: "447035825188",
  appId: "1:447035825188:web:24f533f37cc04e7ae653d9",
  measurementId: "GL-ZLWCP130K3"
};

// Serviços
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { AsyncStorage };
export default app;