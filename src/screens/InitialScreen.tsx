import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function InitialScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Bem-vindo</Text>
      <Text style={styles.subtitle}>Escolha uma opção:</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>🔐 Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>👤 Cadastrar-se</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('List')}
      >
        <Text style={styles.buttonText}>👥 Usuários Cadastrados</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
