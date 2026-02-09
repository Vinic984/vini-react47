import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, firebaseConfig, saveUsuarioRest } from '../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [nomeError, setNomeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telefoneError, setTelefoneError] = useState(false);

  const validarEmail = (email: string) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const validarTelefone = (telefone: string) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    return apenasNumeros.length === 11;
  };

  const validarNome = (nome: string) => {
    return nome.trim().length >= 3;
  };

  const validarFormulario = () => {
    let temErro = false;

    if (!validarNome(nome)) {
      setNomeError(true);
      temErro = true;
    } else {
      setNomeError(false);
    }

    if (!validarEmail(email)) {
      setEmailError(true);
      temErro = true;
    } else {
      setEmailError(false);
    }

    if (!validarTelefone(telefone)) {
      setTelefoneError(true);
      temErro = true;
    } else {
      setTelefoneError(false);
    }

    return !temErro;
  };

  const salvarDados = async () => {
    if (!validarFormulario()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    try {
      const novoUsuario = {
        id: String(Date.now()),
        nome: nome,
        email: email,
        telefone: telefone,
        data: new Date().toLocaleDateString('pt-BR'),
      };

      // Salvar localmente primeiro (garante persistência offline)
      let localSaved = false;
      try {
        const dados = await AsyncStorage.getItem('usuarios');
        let usuarios: any = [];

        if (dados) {
          try {
            usuarios = JSON.parse(dados);
            if (!Array.isArray(usuarios)) usuarios = [];
          } catch (e) {
            usuarios = [];
          }
        }

        // marcar como pendente
        const pendente = { ...novoUsuario, _synced: false };
        usuarios.push(pendente);
        await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
        localSaved = true;
        // eslint-disable-next-line no-console
        console.log('Dados salvos localmente (AsyncStorage).');
      } catch (localErr) {
        // eslint-disable-next-line no-console
        console.error('Falha ao salvar localmente:', localErr);
      }
      // debug: mostrar que vamos tentar gravar e capturar referência do documento
      // eslint-disable-next-line no-console
      console.log('Tentando gravar usuário no Firestore:', novoUsuario);

      // Teste de leitura antes da gravação para detectar problemas de permissão/conexão
      try {
        const snapshot = await getDocs(collection(db, 'usuarios'));
        // eslint-disable-next-line no-console
        console.log('Leitura de teste: documentos em usuarios =', snapshot.size);
      } catch (readErr) {
        // eslint-disable-next-line no-console
        console.error('Erro ao ler coleção usuarios antes de gravar:', readErr);
      }

      // Tentar addDoc com timeout — se travar, caímos no fallback REST
      // Usar REST diretamente (mais confiável em Expo managed). saveUsuarioRest grava usando o id local
      let docRef: any = null;
      try {
        const json = await saveUsuarioRest(novoUsuario);
        // json.name = projects/.../documents/usuarios/{id}
        const docId = json.name?.split('/').pop() || novoUsuario.id;
        docRef = { id: docId };

        // marcar como sincronizado no AsyncStorage
        try {
          const dados = await AsyncStorage.getItem('usuarios');
          if (dados) {
            const usuarios = JSON.parse(dados);
            const idx = usuarios.findIndex((u: any) => u.id === novoUsuario.id);
            if (idx !== -1) {
              usuarios[idx]._synced = true;
              await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
            }
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Erro ao marcar _synced localmente:', e);
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('Gravação via REST falhou:', e);
        // mostrar erro detalhado ao usuário para diagnóstico
        try {
          const message = e?.body ? JSON.stringify(e.body) : e?.message || String(e);
          // se a mensagem indicar que o DB default não existe, oferecer abrir Console
          const lower = String(message).toLowerCase();
          if (lower.includes('database (default) does not exist') || lower.includes('not_found')) {
            Alert.alert('Erro ao enviar para Firebase', 'O banco Firestore (default) não existe para este projeto. Abrindo Console do Google Cloud...');
            try {
              const url = `https://console.cloud.google.com/datastore/setup?project=${encodeURIComponent(String(process.env.FIREBASE_PROJECT_ID || 'crudreactnative-88c7b'))}`;
              // eslint-disable-next-line no-console
              console.log('Abrindo Console para criar Firestore:', url);
              Linking.openURL(url);
            } catch (openErr) {
              // eslint-disable-next-line no-console
              console.error('Falha ao abrir Console URL:', openErr);
              Alert.alert('Erro', message);
            }
          } else {
            Alert.alert('Erro ao enviar para Firebase', message);
          }
        } catch (alertErr) {
          // ignore
        }
        docRef = null;
      }

      // eslint-disable-next-line no-console
      console.log('Documento gravado com ID:', docRef?.id);

      if (docRef && docRef.id) {
        Alert.alert('Sucesso', `Cadastro realizado com sucesso! (ID: ${docRef.id})`);
      } else if (localSaved) {
        Alert.alert('Sucesso local', 'Dados salvos localmente, não foi possível enviar para o Firebase no momento.');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar os dados localmente nem no Firebase.');
      }

      setNome('');
      setEmail('');
      setTelefone('');
      setNomeError(false);
      setEmailError(false);
      setTelefoneError(false);

      navigation.navigate('List');
    } catch (erro: any) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar no Firestore:', erro);
      Alert.alert('Erro', `Não foi possível salvar os dados: ${erro?.message || erro}`);
    }
  };

  const formatarTelefone = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, '');
    
    if (apenasNumeros.length === 0) return '';
    if (apenasNumeros.length <= 2) return `(${apenasNumeros}`;
    if (apenasNumeros.length <= 7) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    }
    
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Usuários</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nome</Text>
        {nomeError ? <TextInput
          style={styles.inputError}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={(texto) => {
            setNome(texto);
            setNomeError(false);
          }}
        /> : <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={(texto) => {
            setNome(texto);
            setNomeError(false);
          }}
        />}
        {nomeError ? <Text style={styles.textoErro}>Nome deve ter no mínimo 3 caracteres</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        {emailError ? <TextInput
          style={styles.inputError}
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            setEmailError(false);
          }}
        /> : <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            setEmailError(false);
          }}
        />}
        {emailError ? <Text style={styles.textoErro}>Email inválido</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Telefone</Text>
        {telefoneError ? <TextInput
          style={styles.inputError}
          placeholder="(XX) XXXXX-XXXX"
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={(texto) => {
            setTelefone(formatarTelefone(texto));
            setTelefoneError(false);
          }}
        /> : <TextInput
          style={styles.input}
          placeholder="(XX) XXXXX-XXXX"
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={(texto) => {
            setTelefone(formatarTelefone(texto));
            setTelefoneError(false);
          }}
        />}
        {telefoneError ? <Text style={styles.textoErro}>Telefone deve conter 11 dígitos</Text> : null}
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity 
          style={styles.botaoSalvar}
          onPress={salvarDados}
        >
          <Text style={styles.botaoTexto}>SALVAR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botaoLista}
          onPress={() => navigation.navigate('List')}
        >
          <Text style={styles.botaoTexto}>VER CADASTRADOS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botaoTexto}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textoErro: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  botoesContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  botaoLista: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  botaoVoltar: {
    backgroundColor: '#757575',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
