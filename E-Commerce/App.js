import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import Home from './screens/Home'
import Login from './screens/Login'
import RegisterUser from './screens/RegisterUser'

// import { NavigationContainer } from '@react-navigation/native'
// const Stack = createNativeStackNavigator();

  export default function App() {
    return (
      // <NavigationContainer>
      //   <Stack.Navigator initialRouteName="Home">
      //     <Stack.Screen name="Home" component={Home}/>
      //     <Stack.Screen name="Login" component={Login} />
      //   </Stack.Navigator>
      // </NavigationContainer>
      <View>
        <Home/>
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
