import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [loading, setLoading] = useState(false);

  const renderHomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>VA</Text>
        </View>
        <Text style={styles.appName}>Vinicius App</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Gerencie seus usuários com facilidade</Text>
        
        <View style={styles.featuresGrid}>
          <TouchableOpacity 
            style={styles.featureCard} 
            onPress={() => setCurrentScreen('login')}
          >
            <View style={styles.featureIcon}>
              <Text style={styles.iconText}>🔐</Text>
            </View>
            <Text style={styles.featureTitle}>Login</Text>
            <Text style={styles.featureDescription}>Acessar sua conta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard} 
            onPress={() => setCurrentScreen('register')}
          >
            <View style={styles.featureIcon}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.featureTitle}>Cadastrar-se</Text>
            <Text style={styles.featureDescription}>Criar nova conta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard} 
            onPress={() => setCurrentScreen('users')}
          >
            <View style={styles.featureIcon}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <Text style={styles.featureTitle}>Usuários</Text>
            <Text style={styles.featureDescription}>Ver todos os usuários</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureCard} 
            onPress={() => setCurrentScreen('reset')}
          >
            <View style={styles.featureIcon}>
              <Text style={styles.iconText}>🔑</Text>
            </View>
            <Text style={styles.featureTitle}>Resetar Senha</Text>
            <Text style={styles.featureDescription}>Recuperar acesso</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Config</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoginScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Login</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              Alert.alert('Sucesso!', 'Login simulado com sucesso!');
              setCurrentScreen('home');
            }}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => setCurrentScreen('reset')}
          >
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderRegisterScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Cadastrar-se</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              Alert.alert('Sucesso!', 'Cadastro simulado com sucesso!');
              setCurrentScreen('home');
            }}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderUsersScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.usersList}>
          <Text style={styles.sectionTitle}>Usuários Cadastrados (0)</Text>
          
          <Text style={styles.emptyMessage}>Nenhum usuário cadastrado ainda.\n\nCadastre-se primeiro para ver usuários aqui.</Text>
          
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Adicionar Novo Usuário</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderResetScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Resetar Senha</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              Alert.alert('Email Enviado!', 'Um link para redefinir sua senha foi enviado para o seu e-mail.');
              setCurrentScreen('home');
            }}
          >
            <Text style={styles.buttonText}>Enviar Email de Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Renderiza a tela atual
  switch (currentScreen) {
    case 'login':
      return renderLoginScreen();
    case 'register':
      return renderRegisterScreen();
    case 'users':
      return renderUsersScreen();
    case 'reset':
      return renderResetScreen();
    default:
      return renderHomeScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E1E1E',
    marginTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 110,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomNav: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#6B7280',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E1E1E',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  button: {
    width: '85%',
    height: 52,
    backgroundColor: '#4A90E2',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
  usersList: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  userDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    padding: 20,
  },
});