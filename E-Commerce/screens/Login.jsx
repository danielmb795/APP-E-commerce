import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Login() {

  const navigation = useNavigation();

  return (


    <View style={styles.container}>
      <View style={styles.loginBox}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={40} color="#6366f1" />
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>Faça login na sua conta</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons 
              name="person-outline" 
              size={20} 
              color="#6b7280" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username ou Email"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color="#6b7280" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
            <TouchableOpacity style={styles.eyeIcon}>
              <Ionicons 
                name="eye-outline" 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botao}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.textoBotao}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registroContainer}>
            <Text style={styles.registro}>
              Não tem uma conta?{' '}
            </Text>
            <TouchableOpacity
            
            >
              <TouchableOpacity 
                onPress={() => navigation.navigate("RegisterUser")}
              >
              <Text style={styles.link}>Cadastre-se</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginBox: {
    backgroundColor: '#1e1e1e',
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fff',
    paddingRight: 15,
  },
  eyeIcon: {
    padding: 15,
  },
  botao: {
    backgroundColor: '#6366f1',
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  dividerText: {
    color: '#9ca3af',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  registroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registro: {
    fontSize: 14,
    color: '#9ca3af',
  },
  link: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14,
  },
});