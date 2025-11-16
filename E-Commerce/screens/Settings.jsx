import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Menu from '../components/Menu'; // <<<--- IMPORTAÇÃO CORRETA

export default function Settings({ navigation }) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Tela de Configurações</Text>
      </View>
      <Menu navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});