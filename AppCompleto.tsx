import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBz0uWpqsqmxUYNW_RcKa0EUWJwxyuY",
  authDomain: "crudreactnative-1b7bc.firebaseapp.com",
  projectId: "crudreactnative-1b7bc",
  storageBucket: "crudreactnative-1b7bc.firebasestorage.app",
  messagingSenderId: "447035825188",
  appId: "1:447035825188:web:24f533f37cc04e7ae653d9",
  measurementId: "GL-ZLWCP130K3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function AppCompleto() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home'); // home, login, register, users, reset
  const [users, setUsers] = useState([]); // Começa vazio
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso!', `Login realizado com: ${email}`);
      setCurrentScreen('home');
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Erro de Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva dados adicionais no Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Sucesso!', `Cadastro realizado: ${name}\n\nEmail: ${email}\n\nAgora você pode fazer login.`);
      setCurrentScreen('home');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setCurrentScreen('reset');
  };

  const handleSendResetCode = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      Alert.alert('Erro', 'Digite um e-mail válido');
      return;
    }

    setLoading(true);
    try {
      // Envia email de reset real usando Firebase
      await sendPasswordResetEmail(auth, resetEmail);
      
      Alert.alert(
        'Email Enviado!',
        `Um link para redefinir sua senha foi enviado para: ${resetEmail}\n\nVerifique sua caixa de entrada e spam.\n\nO link expira em poucas horas.`
      );
      
      // Limpa o campo de email após envio
      setResetEmail('');
      setCurrentScreen('home');
    } catch (error) {
      Alert.alert('Erro ao Enviar Email', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de usuários');
    }
  };

  // Carrega usuários quando a tela de usuários é exibida
  React.useEffect(() => {
    if (currentScreen === 'users') {
      handleLoadUsers();
    }
  }, [currentScreen]);

  const handleEditUser = (userId: string, currentName: string, currentEmail: string) => {
    Alert.prompt(
      '✏️ Editar Usuário',
      `Edite os dados de ${currentName}:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: async (input) => {
            if (input && input.includes(',')) {
              const [name, email] = input.split(',').map(s => s.trim());
              if (name && email && email.includes('@')) {
                try {
                  await updateDoc(doc(db, 'users', userId), {
                    name: name,
                    email: email
                  });
                  
                  // Recarrega a lista de usuários
                  handleLoadUsers();
                  
                  Alert.alert('✅ Atualizado!', `Usuário atualizado com sucesso.`);
                } catch (error) {
                  Alert.alert('Erro ao Atualizar', error.message);
                }
              } else {
                Alert.alert('❌ Erro', 'Formato inválido. Use: Nome, email@exemplo.com');
              }
            } else {
              Alert.alert('❌ Erro', 'Use o formato: Nome, email@exemplo.com');
            }
          }
        }
      ],
      'plain-text',
      `${currentName}, ${currentEmail}`
    );
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    Alert.alert(
      '🗑️ Excluir Usuário',
      `Tem certeza que deseja excluir ${userName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId));
              
              // Recarrega a lista de usuários
              handleLoadUsers();
              
              Alert.alert('✅ Excluído!', `${userName} foi removido da lista.`);
            } catch (error) {
              Alert.alert('Erro ao Excluir', error.message);
            }
          }
        }
      ]
    );
  };

  const handleAddUser = () => {
    Alert.prompt(
      '➕ Adicionar Usuário',
      'Digite o nome e e-mail do novo usuário (separados por vírgula):',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adicionar',
          onPress: async (input) => {
            if (input && input.includes(',')) {
              const [name, email] = input.split(',').map(s => s.trim());
              if (name && email && email.includes('@')) {
                try {
                  await addDoc(collection(db, 'users'), {
                    name: name,
                    email: email,
                    createdAt: new Date().toISOString()
                  });
                  
                  // Recarrega a lista de usuários
                  handleLoadUsers();
                  
                  Alert.alert('✅ Usuário Adicionado!', `${name} (${email}) foi adicionado à lista.`);
                } catch (error) {
                  Alert.alert('Erro ao Adicionar', error.message);
                }
              } else {
                Alert.alert('❌ Erro', 'Formato inválido. Use: Nome, email@exemplo.com');
              }
            } else {
              Alert.alert('❌ Erro', 'Use o formato: Nome, email@exemplo.com');
            }
          }
        }
      ],
      'plain-text',
      'Nome, email@exemplo.com'
    );
  };

  const renderHomeScreen = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>VA</Text>
          </View>
        </View>
        <Text style={styles.appName}>Vinicius App</Text>
      </View>

      {/* Conteúdo Principal */}
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
            onPress={handleResetPassword}
          >
            <View style={styles.featureIcon}>
              <Text style={styles.iconText}>🔑</Text>
            </View>
            <Text style={styles.featureTitle}>Resetar Senha</Text>
            <Text style={styles.featureDescription}>Recuperar acesso</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={handleResetPassword}
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
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
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
          <Text style={styles.sectionTitle}>Usuários Cadastrados ({users.length})</Text>
          
          {users.length === 0 ? (
            <Text style={styles.emptyMessage}>Nenhum usuário cadastrado ainda.\n\nCadastre-se primeiro para ver usuários aqui.</Text>
          ) : (
            users.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userDate}>Cadastrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</Text>
                </View>
                <View style={styles.userActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditUser(user.id, user.name, user.email)}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUser(user.id, user.name)}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
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
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSendResetCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar Email de Reset</Text>
            )}
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
