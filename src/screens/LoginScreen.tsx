import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { authService } from '../firebase/authService';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erro de Login', result.error || 'Ocorreu um erro');
      return;
    }

    // Se o login foi bem-sucedido, a navegação acontecerá automaticamente
    // através do onAuthStateChanged configurado na App.tsx
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return;
    }

    setResetLoading(true);
    const result = await authService.sendPasswordReset(resetEmail);
    setResetLoading(false);

    if (result.success) {
      Alert.alert(
        'Sucesso',
        'Email de redefinição de senha foi enviado!\nVerifique sua caixa de entrada.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowForgotPassword(false);
              setResetEmail('');
            },
          },
        ]
      );
    } else {
      Alert.alert('Erro', result.error || 'Ocorreu um erro ao enviar o email');
    }
  };

  if (showForgotPassword) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Redefinir Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            value={resetEmail}
            onChangeText={setResetEmail}
            keyboardType="email-address"
            editable={!resetLoading}
          />

          {resetLoading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Enviar Email de Redefinição</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
              >
                <Text style={styles.buttonText}>Voltar ao Login</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => setShowForgotPassword(true)}
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Registre-se aqui</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  forgotButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});