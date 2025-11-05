import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import Home from './screens/Home'
import Login from './screens/Login'
import RegisterUser from './screens/RegisterUser'
import Description from './screens/Description';
import Router from './routes/router';

export default function App() {
    return (
      <Router />
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
