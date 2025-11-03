import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterUser() {
  return (
    <View style={styles.container}>
      <View style={styles.cadastroBox}>
        
        <View style={styles.header}>
          <Ionicons name="person-add" size={40} color="#6366f1" />
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se a nós</Text>
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
              placeholder="Nome completo"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color="#6b7280" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Senha"
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

          <View style={styles.inputContainer}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color="#6b7280" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
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

          <View style={styles.termosContainer}>
            <TouchableOpacity style={styles.checkbox}>
              <Ionicons name="square-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.termosText}>
              Concordo com os <Text style={styles.termosLink}>Termos de Serviço</Text> e <Text style={styles.termosLink}>Política de Privacidade</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.botao}>
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Já tem uma conta?{' '}
            </Text>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    top: 10
  },
  cadastroBox: {
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
    marginBottom: 25,
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
    marginBottom: 15,
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
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  termosText: {
    flex: 1,
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  termosLink: {
    color: '#6366f1',
    fontWeight: '500',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  loginLink: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14,
  },
});