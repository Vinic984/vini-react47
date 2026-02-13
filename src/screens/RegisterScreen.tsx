import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import syncPendingUsuarios from '../firebase/syncPending';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    // 1. Registra no Firebase Auth
    const result = await signUp(email, password);
    
    if (result.success) {
      // 2. Salva dados localmente (offline-first)
      const userData = { 
        name, 
        email, 
        uid: result.user?.uid,
        registeredAt: new Date().toISOString() 
      };
      
      const existing = await AsyncStorage.getItem('usuarios');
      const usuarios = existing ? JSON.parse(existing) : [];
      usuarios.push(userData);
      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

      // 3. Tenta sincronizar com Firestore (se houver internet)
      await syncPendingUsuarios();

      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { fontSize: 24, color: '#007AFF' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, color: '#007AFF', textAlign: 'center' }
});