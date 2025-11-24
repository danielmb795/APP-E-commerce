import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  TextInput, Alert, Modal, Image, ActivityIndicator, RefreshControl 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Menu from '../components/Menu';
import { uploadToCloudinary } from '../services/cloudinary';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';

export default function Saller({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, lowStock: 0, totalValue: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null,
    imageUrl: null
  });

  const categories = ['PROCESSOR', 'MOTHERBOARD', 'RAM_MEMORY', 'STORAGE', 'VIDEO_CARD', 'COOLER', 'POWER_SUPPLY', 'CASE', 'PERIPHERAL', 'OTHER'];

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Calcula estatísticas sempre que a lista de produtos muda
  useEffect(() => {
    if (products) {
      const totalProducts = products.length;
      const lowStock = products.filter(p => p.stock < 5).length;
      // Garante que o preço seja tratado como número para a soma
      const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

      setStats({ totalProducts, lowStock, totalValue });
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      if(!refreshing) setLoading(true);
      
      const response = await api.get('/ws/product/myproducts');

      if (response.data) {
        // Suporte tanto para retorno direto de array quanto Pageable do Spring
        const rawData = Array.isArray(response.data) ? response.data : (response.data.content || []);
        
        const adaptedProducts = rawData.map(product => ({
          id: product.id,
          title: product.model || product.description || 'Produto sem nome',
          category: product.type || product.brand || 'Outros',
          brand: product.brand,
          // Conversão forçada para Float para evitar erros de cálculo
          price: product.price ? parseFloat(product.price) : 0,
          description: product.description || '',
          image: product.imageUrl || 'https://via.placeholder.com/150',
          imageUrl: product.imageUrl,
          stock: product.stock || 0,
          currency: product.currency
        }));

        setProducts(adaptedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      if (error.response?.status !== 404) {
        Alert.alert('Aviso', 'Não foi possível carregar seus produtos.');
      }
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploading(true);
        try {
          const cloudinaryUrl = await uploadToCloudinary(result.assets[0].uri);
          setNewProduct(prev => ({
            ...prev,
            image: result.assets[0].uri,
            imageUrl: cloudinaryUrl
          }));
          Alert.alert('Sucesso', 'Imagem carregada com sucesso!');
        } catch (uploadError) {
          Alert.alert('Erro no upload', 'Não foi possível enviar a imagem.');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a imagem');
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Nome e Preço)');
      return;
    }

    if (!newProduct.imageUrl) {
      Alert.alert('Atenção', 'É necessário adicionar uma imagem do produto.');
      return;
    }

    setSaving(true);

    try {
      const priceFormatted = parseFloat(newProduct.price.toString().replace(',', '.'));

      const productData = {
        description: newProduct.description || newProduct.name,
        brand: 'Generic', 
        model: newProduct.name,
        currency: 'BRL',
        price: priceFormatted,
        imageUrl: newProduct.imageUrl,
        type: newProduct.category || 'OTHER'
      };

      await api.post('/ws/product', productData);
      
      Alert.alert('Sucesso', 'Produto cadastrado!');
      
      setNewProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        image: null,
        imageUrl: null
      });

      setActiveTab('list');
      fetchProducts();

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct.title || !editingProduct.price) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    setSaving(true);

    try {
      const priceFormatted = parseFloat(editingProduct.price.toString().replace(',', '.'));

      const productData = {
        description: editingProduct.description,
        brand: editingProduct.brand || 'Generic',
        model: editingProduct.title,
        currency: editingProduct.currency || 'BRL',
        price: priceFormatted,
        imageUrl: editingProduct.imageUrl,
        type: editingProduct.category
      };

      await api.put(`/ws/product/${editingProduct.id}`, productData);
      Alert.alert('Sucesso', 'Produto atualizado!');
      setEditModalVisible(false);
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja excluir este produto permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/ws/product/${id}`);
              Alert.alert('Sucesso', 'Produto excluído!');
              fetchProducts();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          }
        }
      ]
    );
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setEditModalVisible(true);
  };

  // Funções de Renderização para evitar perda de foco
  const renderStatsOverview = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <AntDesign name="product" size={24} color="#6366f1" />
        <Text style={styles.statNumber}>{stats.totalProducts}</Text>
        <Text style={styles.statLabel}>Produtos</Text>
      </View>
      <View style={styles.statCard}>
        <AntDesign name="stock" size={24} color="#f59e0b" />
        <Text style={styles.statNumber}>{stats.lowStock}</Text>
        <Text style={styles.statLabel}>Estoque Baixo</Text>
      </View>
      <View style={styles.statCard}>
        <FontAwesome6 name="money-bill-transfer" size={24} color="#10b981" />
        <Text style={styles.statNumber}>R$ {stats.totalValue.toFixed(2)}</Text>
        <Text style={styles.statLabel}>Valor Total</Text>
      </View>
    </View>
  );

  const renderProductList = () => (
    <View style={styles.tabContent}>
      <LinearGradient colors={['#0f0f0f', '#1a1a1a']} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Meus Produtos</Text>
            <Text style={styles.subtitle}>{products.length} produtos cadastrados</Text>
          </View>
          <TouchableOpacity style={styles.reloadButton} onPress={fetchProducts}>
            <Icon name="refresh" size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderStatsOverview()}

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Fontisto name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filtrar por categoria:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            style={[styles.filterChip, filterCategory === 'all' && styles.filterChipActive]}
            onPress={() => setFilterCategory('all')}
          >
            <Text style={[styles.filterChipText, filterCategory === 'all' && styles.filterChipTextActive]}>Todos</Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, filterCategory === category && styles.filterChipActive]}
              onPress={() => setFilterCategory(category)}
            >
              <Text style={[styles.filterChipText, filterCategory === category && styles.filterChipTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="inventory" size={64} color="#666" />
          <Text style={styles.emptyText}>
            {searchQuery || filterCategory !== 'all' ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.productList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productListContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        >
          {filteredProducts.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { product })}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} defaultSource={{ uri: 'https://via.placeholder.com/150' }} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(product)}>
                  <Icon name="edit" size={20} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(product.id)}>
                  <Icon name="delete" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderEditProductModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Produto</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {editingProduct && (
            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={styles.input}
                value={editingProduct.title}
                onChangeText={(text) => setEditingProduct({ ...editingProduct, title: text })}
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryButton, editingProduct.category === category && styles.categoryButtonActive]}
                    onPress={() => setEditingProduct({ ...editingProduct, category })}
                  >
                    <Text style={[styles.categoryText, editingProduct.category === category && styles.categoryTextActive]}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Preço (R$) *</Text>
              <TextInput
                style={styles.input}
                value={editingProduct.price.toString()}
                onChangeText={(text) => setEditingProduct({ ...editingProduct, price: text })}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editingProduct.description}
                onChangeText={(text) => setEditingProduct({ ...editingProduct, description: text })}
                multiline
                numberOfLines={3}
                placeholderTextColor="#666"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleEditProduct} disabled={saving}>
                  {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveButtonText}>Salvar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderAddProduct = () => (
    <ScrollView style={styles.tabContent}>
      <LinearGradient colors={['#0f0f0f', '#1a1a1a']} style={styles.header}>
        <Text style={styles.title}>Cadastrar Produto</Text>
        <Text style={styles.subtitle}>Preencha os dados do hardware</Text>
      </LinearGradient>

      <View style={styles.form}>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage} disabled={uploading}>
          {uploading ? (
            <View style={styles.uploadPlaceholder}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.uploadText}>Enviando...</Text>
            </View>
          ) : newProduct.image ? (
            <View>
              <Image source={{ uri: newProduct.image }} style={styles.uploadedImage} />
              <Text style={styles.uploadSuccessText}>✅ Imagem carregada</Text>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Icon name="add-a-photo" size={40} color="#666" />
              <Text style={styles.uploadText}>Adicionar Imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome do Produto *</Text>
        <TextInput
          style={styles.input}
          value={newProduct.name}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
          placeholder="Ex: RTX 4060 Ti 8GB"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, newProduct.category === category && styles.categoryButtonActive]}
              onPress={() => setNewProduct(prev => ({ ...prev, category }))}
            >
              <Text style={[styles.categoryText, newProduct.category === category && styles.categoryTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Preço (R$) *</Text>
        <TextInput
          style={styles.input}
          value={newProduct.price}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
          placeholder="0.00"
          placeholderTextColor="#666"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={newProduct.description}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, description: text }))}
          placeholder="Descreva as especificações..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={3}
        />

        <View style={styles.publishSection}>
          <TouchableOpacity
            style={[styles.publishButton, (uploading || saving || !newProduct.imageUrl) && styles.disabledButton]}
            onPress={handleAddProduct}
            disabled={uploading || saving || !newProduct.imageUrl}
          >
            {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.publishButtonText}>PUBLICAR PRODUTO</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={[styles.tab, activeTab === 'list' && styles.activeTab]} onPress={() => setActiveTab('list')}>
            <AntDesign name="product" size={24} color={activeTab === 'list' ? '#6366f1' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Meus Produtos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab, activeTab === 'add' && styles.activeTab]} onPress={() => setActiveTab('add')}>
            <Entypo name="publish" size={24} color={activeTab === 'add' ? '#6366f1' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          {activeTab === 'list' ? renderProductList() : renderAddProduct()}
        </View>

        {renderEditProductModal()}
      </View>

      <Menu navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    marginTop: 18
  },
  mainContent: {
    flex: 1,
    paddingBottom: 80,
  },
  tabContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  reloadButton: {
    padding: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 20,
    marginLeft: 10,
  },
  productList: {
    paddingHorizontal: 20,
  },
  productListContent: {
    paddingBottom: 30,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 6,
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterLabel: {
    color: '#94a3b8',
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 14,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterContent: {
    paddingRight: 40,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#94a3b8',
    marginTop: 10,
  },
  productCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: '#6366f1',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  productDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  form: {
    padding: 20,
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  uploadSubtext: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadSuccessText: {
    color: '#10b981',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  label: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    color: '#f1f5f9',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 10,
  },
  publishSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  publishButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#333',
    opacity: 0.7,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  helperText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  modalBody: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  cancelButtonText: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});