import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import Home from './screens/Home';
import Login from './screens/Login';
import RegisterUser from './screens/RegisterUser';
import CartScreen from './screens/CartScreen';
import DescriptionUserScreen from './screens/DescriptionUser.jsx';
import ProductDetail from './screens/ProductDetail.jsx';
import Saller from './screens/Saller.jsx';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './contexts/CartContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ headerShown: false }}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});