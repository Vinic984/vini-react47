import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppSimple() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 App Funcionando!</Text>
      <Text style={styles.subtitle}>Tela inicial carregada com sucesso</Text>
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
    color: '#666',
    textAlign: 'center',
  },
});
