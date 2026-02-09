


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyAtB6Cwe0JW-oR6r__SXD57ePVkAPnMtDQ',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'crudreactnative-88c7b.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'crudreactnative-88c7b',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'crudreactnative-88c7b.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '712773451602',
  appId: process.env.FIREBASE_APP_ID || '1:712773451602:web:219ba6b5125c0dd0d7048b',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-LJTMB0DSQN',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Log básico para confirmar inicialização em tempo de execução (remova em produção)
try {
  // eslint-disable-next-line no-console
  console.log('Firebase inicializado:', firebaseConfig.projectId);
} catch (e) {}

export { db, firebaseConfig };

// Grava um documento no Firestore via REST usando o id fornecido (cria/atualiza)
export async function saveUsuarioRest(novoUsuario: { id: string; nome: string; email: string; telefone: string; data: string }) {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/usuarios/${String(novoUsuario.id)}?key=${firebaseConfig.apiKey}`;

  const body = {
    fields: {
      id: { stringValue: String(novoUsuario.id) },
      nome: { stringValue: novoUsuario.nome },
      email: { stringValue: novoUsuario.email },
      telefone: { stringValue: novoUsuario.telefone },
      data: { stringValue: novoUsuario.data },
    },
  };

  const resp = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await resp.json().catch(() => null);
  if (!resp.ok) {
    // throw a more informative error
    const msg = json ? JSON.stringify(json) : `HTTP ${resp.status}`;
    const err: any = new Error(msg);
    err.code = resp.status;
    err.body = json;
    throw err;
  }
  return json;
}
