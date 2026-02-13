import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// ✅ IMPORTE TODAS AS TELAS
import InitialScreen from '../screens/InitialScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import UserListScreen from '../screens/UserListScreen';
import EditUserScreen from '../screens/EditUserScreen';
import DetailsScreen from '../screens/DetailsSreen'; // <-- nome corrigido 
import ListScreen from '../screens/ListScreen';       
import ProfileScreen from '../screens/ProfileScreen'; 

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} id="main-navigator">
        <Stack.Screen name="Initial" component={InitialScreen} />
        {user ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="UserList" component={UserListScreen} />
            <Stack.Screen name="EditUser" component={EditUserScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}