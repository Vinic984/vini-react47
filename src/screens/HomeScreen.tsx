import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  useEffect(() => {
    console.log('HomeScreen montada');
    return () => console.log('HomeScreen desmontada');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Olá, {user?.email || 'usuário'}!</Text>
      <Text style={styles.title}>Bem-vindo ao Meu Primeiro App!</Text>

      <TouchableOpacity
        style={[styles.button, styles.buttonBlue]}
        onPress={() => navigation.navigate('List')}
      >
        <Text style={styles.buttonText}>Ver Cadastrados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonGreen]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Cadastro de Usuários</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonRed]}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcome: { fontSize: 18, marginBottom: 10, color: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  button: { padding: 15, borderRadius: 8, marginVertical: 10, width: '100%', alignItems: 'center' },
  buttonBlue: { backgroundColor: '#007AFF' },
  buttonGreen: { backgroundColor: '#34C759' },
  buttonRed: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});