import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Home from './screens/Home'
import Login from './screens/Login'
import RegisterUser from './screens/RegisterUser'

export default function App() {
  return (
    <View style={styles.container}>
  
    <Login/>
    </View>
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
