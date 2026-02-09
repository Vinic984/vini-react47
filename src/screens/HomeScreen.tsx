import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  useEffect(() => {
    console.log('HomeScreen montado');
    return () => {
      console.log('HomeScreen desmontado');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Meu Primeiro App!</Text>
      

        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Cadastro de Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => navigation.navigate('List')}
        >
          <Text style={styles.buttonText}>Ver Cadastrados</Text>
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
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#999',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonGreen: {
    backgroundColor: '#4CAF50',
  },
  buttonBlue: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
