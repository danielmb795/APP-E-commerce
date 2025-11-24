import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Menu from '../components/Menu';
import { uploadToCloudinary } from '../services/cloudinary';
import api from '../services/api';

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';

export default function Saller({ navigation }) {
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

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null,
    imageUrl: null
  });

  const categories = ['Processador', 'Placa de Vídeo', 'Memória RAM', 'SSD', 'Placa-Mãe', 'Fonte', 'Gabinete', 'Cooler', 'Monitor'];


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Buscando produtos da API...');
      
      const response = await api.get('/products/brl');
      
      console.log('Resposta da API:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      
      if (response.data && Array.isArray(response.data)) {
        const adaptedProducts = response.data.map(product => ({
          id: product.id?.toString() || Math.random().toString(),
          name: product.model || product.description || 'Produto sem nome',
          category: product.type || product.brand || 'Hardware',
          price: product.price || 0,
          description: product.description || '',
          image: product.imageurl,
          imageUrl: product.imageurl,
          date: product.createdAt || new Date().toLocaleDateString(),
        }));
        
        console.log('Produtos adaptados:', adaptedProducts);
        setProducts(adaptedProducts);
      } else {
        console.log('Response.data não é um array:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      console.error('Detalhes do erro:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const totalProducts = products.length;
    const lowStock = 0;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    
    setStats({ totalProducts, lowStock, totalValue });
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
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
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploading(true);
        
        try {
          const cloudinaryUrl = await uploadToCloudinary(result.assets[0].uri);
          
          setNewProduct({
            ...newProduct, 
            image: result.assets[0].uri,
            imageUrl: cloudinaryUrl
          });
          
          Alert.alert('Sucesso', 'Imagem carregada com sucesso!');
        } catch (uploadError) {
          Alert.alert('Erro no upload', 'Não foi possível enviar a imagem para a nuvem');
          console.error('Upload error:', uploadError);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível carregar a imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    if (!newProduct.imageUrl) {
      Alert.alert('Atenção', 'É necessário adicionar uma imagem do produto');
      return;
    }

    setSaving(true);

    try {
      const productData = {
        description: newProduct.description || `${newProduct.name} - ${newProduct.category}`,
        brand: newProduct.category || 'Hardware',
        model: newProduct.name,
        currency: 'USD',
        price: parseFloat(newProduct.price),
        imageurl: newProduct.imageUrl,
        type: newProduct.category || 'Hardware'
      };

      console.log('Enviando para API:', productData);

      const response = await api.post('/ws/products', productData);
      console.log('Resposta do POST:', response);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sucesso', 'Produto cadastrado na API!');
        
        await fetchProducts();
        
        setNewProduct({ 
          name: '', 
          category: '', 
          price: '', 
          description: '', 
          image: null,
          imageUrl: null 
        });
        
        setActiveTab('list');
      } else {
        throw new Error('Erro na resposta da API');
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      console.error('Detalhes do erro:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto na API');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    setSaving(true);

    try {
      const productData = {
        description: editingProduct.description || `${editingProduct.name} - ${editingProduct.category}`,
        brand: editingProduct.category || 'Hardware',
        model: editingProduct.name,
        currency: 'USD',
        price: parseFloat(editingProduct.price),
        imageurl: editingProduct.imageUrl,
        type: editingProduct.category || 'Hardware'
      };

      console.log('Atualizando produto:', productData);

      const response = await api.put(`/ws/products/${editingProduct.id}`, productData);
      console.log('Resposta do PUT:', response);

      if (response.status === 200 || response.status === 204) {
        Alert.alert('Sucesso', 'Produto atualizado na API!');
        
        await fetchProducts();
        
        setEditModalVisible(false);
      } else {
        throw new Error('Erro na resposta da API');
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      console.error('Detalhes do erro:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível atualizar o produto na API');
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
              console.log('Excluindo produto ID:', id);
              const response = await api.delete(`/ws/products/${id}`);
              console.log('Resposta do DELETE:', response);
              
              if (response.status === 200 || response.status === 204) {
                Alert.alert('Sucesso', 'Produto excluído da API!');
                await fetchProducts();
              } else {
                throw new Error('Erro na resposta da API');
              }
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              console.error('Detalhes do erro:', error.response?.data);
              Alert.alert('Erro', 'Não foi possível excluir o produto da API');
            }
          }
        }
      ]
    );
  };

  const openEditModal = (product) => {
    setEditingProduct({...product});
    setEditModalVisible(true);
  };

  const StatsOverview = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <AntDesign name="product" size={24} color="blue" />
        <Text style={styles.statNumber}>{stats.totalProducts}</Text>
        <Text style={styles.statLabel}>Produtos</Text>
      </View>
      <View style={styles.statCard}>
        <AntDesign name="stock" size={24} color="orange" />
        <Text style={styles.statNumber}>{stats.lowStock}</Text>
        <Text style={styles.statLabel}>Estoque Baixo</Text>
      </View>
      <View style={styles.statCard}>
        <FontAwesome6 name="money-bill-transfer" size={24} color="green" />
        <Text style={styles.statNumber}>R$ {stats.totalValue.toFixed(2)}</Text>
        <Text style={styles.statLabel}>Valor Total</Text>
      </View>
    </View>
  );

  const ProductList = () => (
    <View style={styles.tabContent}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Meus Produtos</Text>
            <Text style={styles.subtitle}>{products.length} produtos cadastrados</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.reloadButton}
            onPress={fetchProducts}
          >
            <Icon name="refresh" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <StatsOverview />

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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, filterCategory === 'all' && styles.filterChipActive]}
            onPress={() => setFilterCategory('all')}
          >
            <Text style={[styles.filterChipText, filterCategory === 'all' && styles.filterChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, filterCategory === category && styles.filterChipActive]}
              onPress={() => setFilterCategory(category)}
            >
              <Text style={[styles.filterChipText, filterCategory === category && styles.filterChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="inventory" size={64} color="#666" />
          <Text style={styles.emptyText}>
            {searchQuery || filterCategory !== 'all' ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || filterCategory !== 'all' ? 'Tente alterar os filtros' : 'Comece cadastrando seu primeiro produto'}
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.productList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productListContent}
        >
          {filteredProducts.map(product => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => openEditModal(product)}
            >
              {product.image && (
                <Image source={{ uri: product.image }} style={styles.productImage} />
              )}
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <Text style={styles.productCategory}>{product.category}</Text>
                <View style={styles.productDetails}>
                  <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteProduct(product.id)}
              >
                <Icon name="delete" size={20} color="#ff4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const EditProductModal = () => (
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
                value={editingProduct.name}
                onChangeText={(text) => setEditingProduct({...editingProduct, name: text})}
                placeholder="Nome do produto"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      editingProduct.category === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setEditingProduct({...editingProduct, category})}
                  >
                    <Text style={[
                      styles.categoryText,
                      editingProduct.category === category && styles.categoryTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Preço (R$) *</Text>
              <TextInput
                style={styles.input}
                value={editingProduct.price.toString()}
                onChangeText={(text) => setEditingProduct({...editingProduct, price: parseFloat(text) || 0})}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editingProduct.description}
                onChangeText={(text) => setEditingProduct({...editingProduct, description: text})}
                placeholder="Descrição do produto..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleEditProduct}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const AddProduct = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Produto</Text>
        <Text style={styles.subtitle}>Preencha os dados do hardware</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity 
          style={styles.imageUpload} 
          onPress={pickImage}
          disabled={uploading}
        >
          {uploading ? (
            <View style={styles.uploadPlaceholder}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.uploadText}>Enviando para nuvem...</Text>
            </View>
          ) : newProduct.image ? (
            <View>
              <Image source={{ uri: newProduct.image }} style={styles.uploadedImage} />
              <Text style={styles.uploadSuccessText}>
                ✅ Imagem pronta para envio
              </Text>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Icon name="add-a-photo" size={40} color="#666" />
              <Text style={styles.uploadText}>Adicionar Imagem</Text>
              <Text style={styles.uploadSubtext}>
                A imagem será salva na nuvem (Cloudinary)
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome do Produto *</Text>
        <TextInput
          style={styles.input}
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({...newProduct, name: text})}
          placeholder="Ex: RTX 4060 Ti 8GB"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                newProduct.category === category && styles.categoryButtonActive
              ]}
              onPress={() => setNewProduct({...newProduct, category})}
            >
              <Text style={[
                styles.categoryText,
                newProduct.category === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço (R$) *</Text>
          <TextInput
            style={styles.input}
            value={newProduct.price}
            onChangeText={(text) => setNewProduct({...newProduct, price: text})}
            placeholder="0.00"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({...newProduct, description: text})}
          placeholder="Descreva as especificações do produto..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={3}
        />

        <View style={styles.publishSection}>
          <TouchableOpacity 
            style={[
              styles.publishButton,
              (uploading || saving || !newProduct.imageUrl) && styles.disabledButton
            ]} 
            onPress={handleAddProduct}
            disabled={uploading || saving || !newProduct.imageUrl}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.publishButtonText}>Publicando...</Text>
              </>
            ) : (
              <>
                <Entypo name="publish" size={24} color="#fff" />
                <Text style={styles.publishButtonText}>PUBLICAR PRODUTO</Text>
              </>
            )}
          </TouchableOpacity>
          
          {!newProduct.imageUrl && (
            <Text style={styles.helperText}>
              Adicione uma imagem para poder publicar
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'list' && styles.activeTab]}
            onPress={() => setActiveTab('list')}
          >
            <AntDesign name="product" size={24} color="#666" />
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
              Meus Produtos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'add' && styles.activeTab]}
            onPress={() => setActiveTab('add')}
          >
            <Entypo 
              name="publish" 
              size={24} 
              color={activeTab === 'add' ? '#007AFF' : '#666'}
            />
            <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          {activeTab === 'list' ? <ProductList /> : <AddProduct />}
        </View>
        
        <EditProductModal />
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
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  reloadButton: {
    padding: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
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
    borderBottomColor: '#007AFF',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
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
    padding: 12,
    color: '#fff',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  filterContainer: {
    maxHeight: 40,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  productCategory: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    color: '#4CD964',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productDescription: {
    color: '#aaa',
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#777',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputGroup: {
    marginBottom: 15,
  },
  categories: {
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    color: '#aaa',
    fontSize: 12,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageUpload: {
    height: 150,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    color: '#666',
    marginTop: 8,
  },
  uploadSubtext: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadSuccessText: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#4CD964',
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  publishSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  publishButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    minWidth: '80%',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  helperText: {
    color: '#FF9500',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  modalTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalBody: {
    padding: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
});