import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Teste App</Text>
      <Text style={styles.subtitle}>Se você está vendo isso, o app está funcionando!</Text>
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
