import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ==================== TELA DE LOGIN ====================
function LoginScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          // Simula login salvando usuário
          await AsyncStorage.setItem('@user', JSON.stringify({ 
            email: 'usuario@email.com' 
          }));
          navigation.replace('Home');
        }}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== TELA HOME ====================
function HomeScreen({ navigation }: any) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    const userData = await AsyncStorage.getItem('@user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserEmail(user.email || 'usuário');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.welcome}>Bem-vindo, {userEmail}!</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.buttonRed]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarUsuario();
  }, []);

  const verificarUsuario = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem('@user');
      setUser(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
    } catch (error) {
      console.log('Erro ao verificar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} id="app-navigator">
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ==================== ESTILOS ====================
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
    marginBottom: 40,
    color: '#333',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonRed: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});