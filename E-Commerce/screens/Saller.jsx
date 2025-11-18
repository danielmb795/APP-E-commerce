import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import Menu from '../components/Menu';


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
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null
  });

  const categories = ['Processador', 'Placa de Vídeo', 'Memória RAM', 'SSD', 'Placa-Mãe', 'Fonte', 'Gabinete', 'Cooler', 'Monitor'];

  // Calcular estatísticas
  useEffect(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 5).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    setStats({ totalProducts, lowStock, totalValue });
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewProduct({...newProduct, image: result.assets[0].uri});
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    const product = {
      id: Date.now().toString(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      date: new Date().toLocaleDateString(),
      sales: 0
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', category: '', price: '', stock: '', description: '', image: null });
    Alert.alert('Sucesso', 'Produto cadastrado!');
    setActiveTab('list');
  };

  const handleEditProduct = () => {
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    setProducts(updatedProducts);
    setEditModalVisible(false);
    Alert.alert('Sucesso', 'Produto atualizado!');
  };

  const openEditModal = (product) => {
    setEditingProduct({...product});
    setEditModalVisible(true);
  };

  const deleteProduct = (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => setProducts(products.filter(p => p.id !== id))
        }
      ]
    );
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

  // Tela de Listagem Melhorada
  const ProductList = () => (
    <View style={styles.tabContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Produtos</Text>
        <Text style={styles.subtitle}>{products.length} produtos cadastrados</Text>
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

      {filteredProducts.length === 0 ? (
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
        <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
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
                  {product.stock < 5 && (
                    <View style={styles.lowStockBadge}>
                      <Text style={styles.lowStockText}>Estoque Baixo</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productCategory}>{product.category}</Text>
                <View style={styles.productDetails}>
                  <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
                  <Text style={[
                    styles.productStock,
                    product.stock < 5 && styles.lowStockText
                  ]}>
                    Estoque: {product.stock}
                  </Text>
                </View>
                <Text style={styles.productSales}>Vendas: {product.sales}</Text>
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
              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                value={editingProduct.name}
                onChangeText={(text) => setEditingProduct({...editingProduct, name: text})}
              />

              <Text style={styles.label}>Preço (R$)</Text>
              <TextInput
                style={styles.input}
                value={editingProduct.price.toString()}
                onChangeText={(text) => setEditingProduct({...editingProduct, price: parseFloat(text) || 0})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Estoque</Text>
              <TextInput
                style={styles.input}
                value={editingProduct.stock.toString()}
                onChangeText={(text) => setEditingProduct({...editingProduct, stock: parseInt(text) || 0})}
                keyboardType="numeric"
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
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
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
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {newProduct.image ? (
            <Image source={{ uri: newProduct.image }} style={styles.uploadedImage} />
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
          onChangeText={(text) => setNewProduct({...newProduct, name: text})}
          placeholder="Ex: RTX 4060 Ti 8GB"
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

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preço (R$) *</Text>
            <TextInput
              style={styles.input}
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({...newProduct, price: text})}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estoque *</Text>
            <TextInput
              style={styles.input}
              value={newProduct.stock}
              onChangeText={(text) => setNewProduct({...newProduct, stock: text})}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({...newProduct, description: text})}
          placeholder="Descreva as especificações do produto..."
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Cadastrar Produto</Text>
        </TouchableOpacity>
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
            <Entypo name="publish" size={24} color="black" />
            <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'list' ? <ProductList /> : <AddProduct />}
        

        <EditProductModal />
      </View>
      <Menu navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  // ======== CONTAINERS ========
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  tabContent: {
    flex: 1,
  },

  // ======== TÍTULOS / CABEÇALHOS ========
  header: {
    padding: 20,
    paddingBottom: 10,
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

  // ======== TAB BAR ========
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

  // ======== ESTATÍSTICAS ========
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

  // ======== BUSCA ========
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

  // ======== FILTRO - CORRIGIDO ========
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

  // ======== LISTA DE PRODUTOS ========
  productList: {
    paddingHorizontal: 20,
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
  },
  productPrice: {
    color: '#4CD964',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productStock: {
    color: '#fff',
    fontSize: 12,
  },
  
  lowStockBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lowStockText: {
    color: '#FF9500',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productSales: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },

  deleteButton: {
    padding: 8,
  },

  // ======== EMPTY STATE ========
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

  // ======== FORM / CADASTRO ========
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginRight: 10,
  },

  // ======== CATEGORIAS ========
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

  // ======== UPLOAD DE IMAGEM ========
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
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  // ======== BOTÃO CADASTRAR ========
  addButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ======== MODAL ========
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
});