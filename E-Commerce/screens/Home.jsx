import React, { useState, useEffect, memo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, TextInput, ActivityIndicator,
  Keyboard, Alert
} from 'react-native';
import axios from 'axios';
import Menu from '../components/Menu';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../contexts/CartContext'; 

const usuario = "UserTeste";

const baseUrl = "https://bare-marris-prof-ferretto-8544d847.koyeb.app"

const Topo = memo(({ usuario, query, filterProducts, styles, navigation }) => (
  <View style={styles.topo}>
    <View style={styles.headerRow}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="O que você está procurando?"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={filterProducts}
          autoFocus={false} 
        />
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <MaterialIcons name="exit-to-app" style={styles.exit}/>
      </TouchableOpacity>
    </View>
  </View>
));

export default function Home({ navigation }) { 
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]); 
  const [masterProdutos, setMasterProdutos] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { adicionarAoCarrinho: adicionarGlobal } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/products/brl`);
        
        const productsData = response.data.content || [];
        
        const formattedProducts = productsData.map(product => ({
          id: product.id,
          title: `${product.brand} ${product.model}`,
          description: product.description,
          price: product.convertedPrice || product.price,
          image: product.imageUrl,
          brand: product.brand,
          model: product.model,
          currency: product.currency,
          stock: product.stock,
          originalData: product 
        }));
        
        setProdutos(formattedProducts);
        setMasterProdutos(formattedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        Alert.alert("Erro", "Não foi possível carregar os produtos");
        setProdutos([]);
      }
      setLoading(false);
    };

    fetchProducts();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };

  }, []);

  const filterProducts = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      setProdutos(masterProdutos);
    } else {
      const lowerQuery = text.toLowerCase();
      const filteredData = masterProdutos.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.brand?.toLowerCase().includes(lowerQuery) ||
        item.model?.toLowerCase().includes(lowerQuery)
      );
      setProdutos(filteredData);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    adicionarGlobal(produto);
    Alert.alert(
      "Produto adicionado!",
      `${produto.title.slice(0, 20)}... foi adicionado ao carrinho.`,
      [{ text: "OK" }]
    );
  };

  const comprarAgora = (produto) => {
    Alert.alert(
      "Compra rápida!",
      `Você está comprando: ${produto.title.slice(0, 20)}...`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => console.log("Compra confirmada:", produto) }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.produtoContainer}>
      <TouchableOpacity 
        style={styles.produto}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.imagem} /> 
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={2}>{item.title}</Text> 
          <Text style={styles.preco}>R$ {item.price?.toFixed(2)}</Text> 
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botaoCarrinho}
        onPress={() => adicionarAoCarrinho(item)}
      >
        <Ionicons name="cart" size={20} color="#fff" />
        <Text style={styles.textoBotaoCarrinho}>Adicionar ao Carrinho</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botaoComprar}
        onPress={() => comprarAgora(item)}
      >
        <Ionicons name="flash" size={20} color="#fff" />
        <Text style={styles.textoBotaoComprar}>Comprar Agora</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Topo 
        usuario={usuario}
        query={query}
        filterProducts={filterProducts}
        styles={styles}
        navigation={navigation}
      />

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
        ) : (
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.listaVazia}>
                <Text style={styles.listaVaziaTexto}>
                  {loading ? "Carregando..." : "Nenhum produto encontrado."}
                </Text>
              </View>
            }
          />
        )}
        
        {!isKeyboardVisible && <Menu navigation={navigation} />} 
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  topo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    zIndex: 10,
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 100, 
  },
  headerRow: {
    flexDirection: 'row',     
    alignItems: 'center',          
    justifyContent: 'space-between',
    width: '100%',
  },
  user: {
    color: "#6366f1",
    fontSize: 40,
  },
  titulo: {
    color: '#6366f1',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  exit: {
    color: "#6366f1",
    fontSize: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    height: 45,
    flex: 1, 
    marginRight: 15, 
  },
  searchIcon: {
    paddingLeft: 15,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  lista: {
    paddingTop: 110, 
    paddingBottom: 100,
  },
  produtoContainer: {
    width: '90%',
    marginLeft: '5%',
    marginBottom: 15,
  },
  produto: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    height: 120,
    borderWidth: 1,
    borderColor: '#333',
    // Sombreamento
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 4,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  info: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  preco: {
    marginTop: 5,
    fontSize: 16,
    color: '#fff',
  },
  botaoCarrinho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  textoBotaoCarrinho: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  botaoComprar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: "#10b981",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  textoBotaoComprar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 110,
    backgroundColor: '#121212',
  },
  listaVazia: {
    alignItems: 'center',
    marginTop: 50,
  },
  listaVaziaTexto: {
    color: '#9ca3af',
    fontSize: 16,
  },
});