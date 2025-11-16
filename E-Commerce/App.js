import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Home from './screens/Home';
import Login from './screens/Login';
import RegisterUser from './screens/RegisterUser';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/Settings.jsx';
import DescriptionUserScreen from './screens/DescriptionUser.jsx';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{
          headerShown: false 
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="DescriptionUser" component={DescriptionUserScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
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