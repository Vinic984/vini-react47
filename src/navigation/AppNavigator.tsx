import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsSreen';
import RegisterScreen from '../screens/RegisterScreen';
import ListScreen from '../screens/ListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator id="root"
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerTitle: 'Início',
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{
          headerTitle: 'Detalhes',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          headerTitle: 'Cadastro',
        }}
      />
      <Stack.Screen 
        name="List" 
        component={ListScreen}
        options={{
          headerTitle: 'Usuários',
        }}
      />
    </Stack.Navigator>
  );
}
