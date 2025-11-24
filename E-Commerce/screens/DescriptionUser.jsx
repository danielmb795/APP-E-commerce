import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'; 
import { useCart } from '../contexts/CartContext';
import * as ImagePicker from 'expo-image-picker'; 

export default function DescriptionUser() {
  const navigation = useNavigation();
  
  const { user, signOut, updateUserProfile } = useAuth(); 
  const { carrinho } = useCart();

  const handleLogout = () => {
    signOut();
    navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });
  }

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para mudar a foto.");
      return;
    }


    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.5, 
    });

    if (!result.canceled) {
      const novaImagemUri = result.assets[0].uri;
      updateUserProfile({ avatar: novaImagemUri });
    }
  };

  if (!user) {
      return (
        <View style={styles.container}>
            <Text style={{color:'white', textAlign:'center', marginTop: 50}}>Faça login para ver seu perfil.</Text>
        </View>
      );
  }

  const displayData = {
    nome: user.name || 'Usuário',
    email: user.email || 'Email não disponível',
    telefone: user.phoneNumber || 'Não cadastrado', 
    endereco: user.address || 'Não cadastrado',
    avatar: user.avatar || 'https://via.placeholder.com/150', 
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f0f', '#1a1a1a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#1e1e1e', '#2d2d2d']}
          style={styles.profileSection}
        >
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: displayData.avatar }} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.avatarBadge} onPress={handlePickImage}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{displayData.nome}</Text>
          <Text style={styles.userEmail}>{displayData.email}</Text>
          
        </LinearGradient>

        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `#6366f120` }]}>
                <Ionicons name="cart-outline" size={24} color="#6366f1" />
              </View>
              <Text style={styles.statValue}>{carrinho.length}</Text>
              <Text style={styles.statLabel}>Itens no Carrinho</Text>
            </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#6366f1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome completo</Text>
                <Text style={styles.infoValue}>{displayData.nome}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#6366f1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{displayData.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#6366f1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{displayData.telefone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#6366f1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoValue}>{displayData.endereco}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Ionicons name="cube-outline" size={28} color="#6366f1" />
              <Text style={styles.aboutTitle}>HardwareStore</Text>
            </View>
            
            <Text style={styles.aboutDescription}>
              Bem-vindo à HardwareStore, este é um projeto acadêmico desenvolvido
              por estudantes de Ciência da computação da Atitus Educação.
            </Text>

            <View style={styles.aboutFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                <Text style={styles.featureText}>Compra 100% segura</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="rocket" size={16} color="#6366f1" />
                <Text style={styles.featureText}>Entrega expressa</Text>
              </View>
            </View>

            <View style={styles.versionInfo}>
              <Text style={styles.versionText}>Versão 2.1.0</Text>
              <Text style={styles.buildText}>Build 2025.11.05</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 120,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6366f1',
  },

  avatarBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#6366f1',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1e1e1e',
    zIndex: 1,
  },
  userName: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 120,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '500',
  },
  aboutCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  aboutDescription: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'justify',
  },
  aboutFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    color: '#e2e8f0',
    fontSize: 14,
    marginLeft: 8,
  },
  versionInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buildText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  footer: {
    height: 20,
  },
});