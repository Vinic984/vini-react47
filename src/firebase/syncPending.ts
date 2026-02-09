import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseConfig';

// Sincroniza registros locais (armazenados em 'usuarios') com o Firestore.
// Retorna um resumo: { attempted, synced, failed, errors }
export default async function syncPendingUsuarios() {
  const summary = { attempted: 0, synced: 0, failed: 0, errors: [] as any[] };

  try {
    // eslint-disable-next-line no-console
    console.log('Iniciando sincronização de pendentes com Firestore...');

    const dados = await AsyncStorage.getItem('usuarios');
    // eslint-disable-next-line no-console
    console.log('Raw AsyncStorage usuarios length:', dados ? dados.length : 0);
    if (!dados) {
      // eslint-disable-next-line no-console
      console.log('Nenhum usuário local para sincronizar.');
      return summary;
    }

    let usuarios: any = [];
    try {
      usuarios = JSON.parse(dados);
      if (!Array.isArray(usuarios)) usuarios = [];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao parsear usuarios do AsyncStorage:', e);
      usuarios = [];
    }

    // eslint-disable-next-line no-console
    console.log('Usuarios parsed count:', usuarios.length, usuarios.map((u: any) => ({ id: u.id, _synced: u._synced })));

    let changed = false;

    for (let i = 0; i < usuarios.length; i++) {
      const u = usuarios[i];
      if (u && u._synced) continue;

      summary.attempted += 1;

      try {
        // Forçar uso do endpoint REST para criar/atualizar documento com id
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/usuarios/${String(u.id)}?key=${firebaseConfig.apiKey}`;
        const body = {
          fields: {
            id: { stringValue: String(u.id) },
            nome: { stringValue: u.nome },
            email: { stringValue: u.email },
            telefone: { stringValue: u.telefone },
            data: { stringValue: u.data },
          },
        };

        const resp = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const json = await resp.json();
        if (!resp.ok) throw json;

        usuarios[i]._synced = true;
        changed = true;
        summary.synced += 1;
        // eslint-disable-next-line no-console
        console.log('Sincronizado no Firestore via REST:', u.id, json.name || json);
      } catch (restErr) {
        summary.failed += 1;
        // tentar extrair mensagem útil do erro REST
        let errMsg = '';
        try {
          if (restErr && typeof restErr === 'object') {
            if ((restErr as any).error && (restErr as any).error.message) {
              errMsg = (restErr as any).error.message;
            } else {
              errMsg = JSON.stringify(restErr);
            }
          } else {
            errMsg = String(restErr);
          }
        } catch (ee) {
          errMsg = String(restErr);
        }

        summary.errors.push({ id: u.id, error: errMsg });
        // eslint-disable-next-line no-console
        console.error('Falha ao sincronizar registro via REST', u.id, errMsg, restErr);
      }
    }

    if (changed) {
      try {
        await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
        // eslint-disable-next-line no-console
        console.log('AsyncStorage atualizado após sincronização.');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Erro ao atualizar AsyncStorage após sync:', e);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Erro no syncPendingUsuarios:', e);
    summary.errors.push({ error: String(e) });
  }

  return summary;
}
