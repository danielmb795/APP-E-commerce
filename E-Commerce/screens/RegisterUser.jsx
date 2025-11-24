import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

export default function RegisterUser() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);


  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!termsAccepted) {
      Alert.alert('Termos de Uso', 'Você precisa concordar com os termos para criar uma conta.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        address: formData.address
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'Fazer Login', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar a conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#121212' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.cadastroBox}>

            <View style={styles.header}>
              <Ionicons name="person-add" size={40} color="#6366f1" />
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Junte-se a nós</Text>
            </View>

            <View style={styles.form}>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#9ca3af"
                  value={formData.name}
                  onChangeText={(t) => handleChange('name', t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(t) => handleChange('email', t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(t) => handleChange('phone', t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Endereço"
                  placeholderTextColor="#9ca3af"
                  multiline
                  value={formData.address}
                  onChangeText={(t) => handleChange('address', t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(t) => handleChange('password', t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(t) => handleChange('confirmPassword', t)}
                />
              </View>

              <View style={styles.termosContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <Ionicons
                    name={termsAccepted ? "checkbox" : "square-outline"}
                    size={24}
                    color={termsAccepted ? "#6366f1" : "#6b7280"}
                  />
                </TouchableOpacity>
                <Text style={styles.termosText}>
                  Concordo com os <Text style={styles.termosLink}>Termos de Serviço</Text> e <Text style={styles.termosLink}>Política de Privacidade</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.botao, !termsAccepted && { opacity: 0.5 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>Cadastrar</Text>}
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
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginLink}>Fazer login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cadastroBox: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
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
    marginVertical: 20,
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
    minHeight: 50,
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingRight: 15,
    paddingVertical: 15,
    minHeight: 50,
  },
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
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