import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default async function syncPendingUsuarios() {
  try {
    console.log(' Iniciando sincronização de pendentes...');
    
    const dados = await AsyncStorage.getItem('usuarios');
    if (!dados) {
      console.log(' Nenhum usuário local para sincronizar.');
      return { attempted: 0, synced: 0, failed: 0, errors: [] };
    }

    let usuarios = [];
    try {
      usuarios = JSON.parse(dados);
      if (!Array.isArray(usuarios)) usuarios = [];
    } catch (e) {
      console.error(' Erro ao parsear usuários:', e);
      return { attempted: 0, synced: 0, failed: 1, errors: [e] };
    }

    let synced = 0;
    let failed = 0;
    const errors = [];

    for (const usuario of usuarios) {
      try {
        await addDoc(collection(db, 'usuarios'), usuario);
        synced++;
      } catch (err) {
        failed++;
        errors.push(err);
      }
    }

    // Limpa após sincronizar
    await AsyncStorage.removeItem('usuarios');

    console.log(` Sincronização concluída: ${synced} sucesso, ${failed} falhas`);
    return { attempted: usuarios.length, synced, failed, errors };
    
  } catch (error) {
    console.error(' Erro geral na sincronização:', error);
    return { attempted: 0, synced: 0, failed: 1, errors: [error] };
  }
}