import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

export default function AppCompleto() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home'); // home, login, register, users, reset
  const [users, setUsers] = useState([]); // Começa vazio
  const [registeredUsers, setRegisteredUsers] = useState([]); // Usuários cadastrados via formulário
  const [resetCode, setResetCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      Alert.alert('Sucesso!', `Login realizado com: ${email}`);
      setLoading(false);
      setCurrentScreen('home');
      setEmail('');
      setPassword('');
    }, 1500);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Em um app real, isso seria criptografado
        createdAt: new Date().toISOString()
      };
      
      setRegisteredUsers([...registeredUsers, newUser]);
      setUsers([...users, newUser]); // Adiciona também à lista de usuários
      
      Alert.alert('Sucesso!', `Cadastro realizado: ${name}\n\nEmail: ${email}\n\nAgora você pode fazer login.`);
      setLoading(false);
      setCurrentScreen('home');
      setName('');
      setEmail('');
      setPassword('');
    }, 1500);
  };

  const handleResetPassword = () => {
    setCurrentScreen('reset');
  };

  const handleSendResetCode = () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      Alert.alert('Erro', 'Digite um e-mail válido');
      return;
    }

    // Verifica se o usuário existe
    const userExists = registeredUsers.find(u => u.email === resetEmail);
    if (!userExists) {
      Alert.alert('Erro', 'Este e-mail não está cadastrado');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetCode(code);
    
    Alert.alert(
      'Código Enviado!',
      `Código: ${code}\n\nEnviado para: ${resetEmail}\n\nUse este código para redefinir sua senha.`
    );
  };

  const handleResetPasswordConfirm = () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Atualiza a senha do usuário
    const updatedUsers = registeredUsers.map(user => 
      user.email === resetEmail 
        ? { ...user, password: newPassword }
        : user
    );
    
    setRegisteredUsers(updatedUsers);
    
    Alert.alert('Sucesso!', 'Senha redefinida com sucesso!\n\nAgora você pode fazer login com a nova senha.');
    
    // Limpa os campos e volta para a tela inicial
    setResetCode('');
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentScreen('home');
  };

  const handleAddUser = () => {
    Alert.prompt(
      '➕ Adicionar Usuário',
      'Digite o nome e e-mail do novo usuário (separados por vírgula):',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adicionar',
          onPress: (input) => {
            if (input && input.includes(',')) {
              const [name, email] = input.split(',').map(s => s.trim());
              if (name && email && email.includes('@')) {
                const newUser = {
                  id: Date.now().toString(),
                  name,
                  email
                };
                setUsers([...users, newUser]);
                Alert.alert('✅ Usuário Adicionado!', `${name} (${email}) foi adicionado à lista.`);
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

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      '🗑️ Excluir Usuário',
      `Tem certeza que deseja excluir ${userName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(user => user.id !== userId));
            Alert.alert('✅ Excluído!', `${userName} foi removido da lista.`);
          }
        }
      ]
    );
  };

  const handleEditUser = (userId: string, currentName: string, currentEmail: string) => {
    Alert.prompt(
      '✏️ Editar Usuário',
      `Edite os dados de ${currentName}:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: (input) => {
            if (input && input.includes(',')) {
              const [name, email] = input.split(',').map(s => s.trim());
              if (name && email && email.includes('@')) {
                setUsers(users.map(user => 
                  user.id === userId ? { ...user, name, email } : user
                ));
                Alert.alert('✅ Atualizado!', `Usuário atualizado com sucesso.`);
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

  const renderHomeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Vinici App</Text>
      <Text style={styles.subtitle}>Gerenciamento de Usuários</Text>
      
      <View style={styles.menu}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.menuButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setCurrentScreen('register')}
        >
          <Text style={styles.menuButtonText}>Cadastrar-se</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setCurrentScreen('users')}
        >
          <Text style={styles.menuButtonText}>Lista de Usuários</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={handleResetPassword}
        >
          <Text style={styles.menuButtonText}>Resetar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoginScreen = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Vinici App</Text>
      
      <View style={styles.form}>
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
    </ScrollView>
  );

  const renderRegisterScreen = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Vinici App</Text>
      
      <View style={styles.form}>
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
    </ScrollView>
  );

  const renderUsersScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Vinici App</Text>
      
      <View style={styles.usersList}>
        <Text style={styles.sectionTitle}>Usuários Cadastrados ({users.length}):</Text>
        
        {users.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhum usuário cadastrado ainda.\n\nCadastre-se primeiro para ver usuários aqui.</Text>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userDate}>Cadastrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</Text>
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
  );

  const renderResetScreen = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Vinici App</Text>
      
      <View style={styles.form}>
        <Text style={styles.formTitle}>Resetar Senha</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={resetEmail}
          onChangeText={setResetEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSendResetCode}
        >
          <Text style={styles.buttonText}>Enviar Código</Text>
        </TouchableOpacity>
        
        {resetCode && (
          <>
            <Text style={styles.codeInfo}>Código enviado: {resetCode}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Digite o código recebido"
              value={resetCode}
              onChangeText={setResetCode}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleResetPasswordConfirm}
            >
              <Text style={styles.buttonText}>Redefinir Senha</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
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
    padding: 20,
    backgroundColor: '#667eea',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  menu: {
    gap: 15,
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    transform: [{ scale: 1 }],
  },
  menuButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  usersList: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  userDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  codeInfo: {
    textAlign: 'center',
    color: '#28a745',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 5,
  },
});
