import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native'; // View importada para uso seguro

import Home from './screens/Home';
import Login from './screens/Login';
import RegisterUser from './screens/RegisterUser';
import CartScreen from './screens/CartScreen';
import DescriptionUserScreen from './screens/DescriptionUser.jsx';
import ProductDetail from './screens/ProductDetail.jsx';
import Saller from './screens/Saller.jsx';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

// Definindo o tema escuro para a navegação
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212', // Define o fundo padrão de todas as telas como preto
  },
};

export default function App() {
  return (
    <AuthProvider> 
      <CartProvider>
        {/* Passando o tema aqui */}
        <NavigationContainer theme={AppTheme}>
          <StatusBar style="light" backgroundColor="#121212" /> 
          <Stack.Navigator 
            initialRouteName="Saller" 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: '#121212' } // Reforço extra
            }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="RegisterUser" component={RegisterUser} />
            <Stack.Screen name="Cart" component={CartScreen} />

            <Stack.Screen name="DescriptionUser" component={DescriptionUserScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} /> 
            <Stack.Screen name="Saller" component={Saller}/>
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  }
});