import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../contexts/CartContext'; // Importar contexto

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [loading, setLoading] = useState(false);
  
  const { adicionarAoCarrinho } = useCart(); // Usar função do contexto

  const handleBuy = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '🎉 Compra realizada com sucesso!',
        `Você comprou: ${product.title}\n\nValor: R$ ${product.price.toFixed(2)}`,
        [
          {
            text: 'Continuar comprando',
            onPress: () => navigation.goBack(),
            style: 'cancel'
          },
          {
            text: 'Ver carrinho',
            onPress: () => navigation.navigate('Cart'),
          }
        ]
      );
      // Opcional: Adicionar ao carrinho antes de comprar
      adicionarAoCarrinho(product);
    }, 1500);
  };

  const handleAddToCart = () => {
    adicionarAoCarrinho(product); // Adiciona de verdade no contexto
    
    Alert.alert(
      '🛒 Produto adicionado!',
      `${product.title} foi adicionado ao carrinho`,
      [
        {
          text: 'Continuar comprando',
          style: 'cancel',
        },
        {
          text: 'Ver carrinho',
          onPress: () => navigation.navigate('Cart'),
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detalhes</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>

          <Text style={styles.productPrice}>
            R$ {product.price.toFixed(2)}
          </Text>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Categoria:</Text>
            <Text style={styles.categoryText}>
              {typeof product.category === 'string' 
                ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
                : 'Eletrônicos'
              }
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.productDescription}>
            {product.description || 'Produto de alta qualidade com excelente custo-benefício.'}
          </Text>
        </View>

        <View style={styles.specsContainer}>
          <Text style={styles.sectionTitle}>Vantagens</Text>
          
          <View style={styles.specItem}>
            <MaterialIcons name="local-shipping" size={20} color="#6366f1" />
            <View style={styles.specTextContainer}>
              <Text style={styles.specTitle}>Frete Grátis</Text>
              <Text style={styles.specDescription}>Para todo o Brasil</Text>
            </View>
          </View>
          
          <View style={styles.specItem}>
            <MaterialIcons name="assignment-return" size={20} color="#6366f1" />
            <View style={styles.specTextContainer}>
              <Text style={styles.specTitle}>Devolução Grátis</Text>
              <Text style={styles.specDescription}>Em até 30 dias</Text>
            </View>
          </View>
          
          <View style={styles.specItem}>
            <MaterialIcons name="security" size={20} color="#6366f1" />
            <View style={styles.specTextContainer}>
              <Text style={styles.specTitle}>Compra Segura</Text>
              <Text style={styles.specDescription}>Seus dados protegidos</Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={loading}
        >
          <Ionicons name="cart" size={20} color="#6366f1" />
          <Text style={styles.addToCartText}>Adicionar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.buyButton, loading && styles.buyButtonDisabled]}
          onPress={handleBuy}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>Comprar Agora</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#121212',
    marginTop: 30, // Ajuste para ficar abaixo da status bar
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#6366f1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  productImage: {
    width: 280,
    height: 280,
  },
  productInfo: {
    padding: 20,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 24,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginRight: 5,
  },
  categoryText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 15,
    color: '#d1d5db',
    lineHeight: 22,
  },
  specsContainer: {
    padding: 20,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  specTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  specTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  specDescription: {
    color: '#9ca3af',
    fontSize: 13,
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 20,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginRight: 12,
  },
  addToCartText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buyButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#4f46e5',
    opacity: 0.7,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});