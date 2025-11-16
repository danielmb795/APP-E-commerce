import React, { useState, useEffect, memo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, TextInput, ActivityIndicator,
  Keyboard
} from 'react-native';
import axios from 'axios';
import Menu from '../components/Menu'; // Assumindo que você moveu para components
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const usuario = "UserTeste";

const Topo = memo(({ usuario, query, filterProducts, styles, navigation }) => (
  <View style={styles.topo}>
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => navigation.navigate('DescriptionUser')}>
        <Ionicons name="person" style={styles.user} />
      </TouchableOpacity>
      
      <Text style={styles.titulo}>Seja bem vindo {usuario} </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <MaterialIcons name="exit-to-app" style={styles.exit}/>
      </TouchableOpacity>
    </View>
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
  </View>
));

export default function Home({ navigation }) { 
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]); 
  const [masterProdutos, setMasterProdutos] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProdutos(response.data);
        setMasterProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
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
        item.title.toLowerCase().includes(lowerQuery)
      );
      setProdutos(filteredData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.produto}>
      <Image source={{ uri: item.image }} style={styles.imagem} /> 
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={2}>{item.title}</Text> 
        <Text style={styles.preco}>R$ {item.price.toFixed(2)}</Text> 
      </View>
    </TouchableOpacity>
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.listaVazia}>
                <Text style={styles.listaVaziaTexto}>Nenhum produto encontrado.</Text>
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
    height: 140,
  },
  headerRow: {
    flexDirection: 'row',     
    alignItems: 'center',          
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
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
    flex: 1, // <<<--- AQUI ESTÁ A CORREÇÃO
    backgroundColor: '#121212',
  },
  lista: {
    paddingTop: 150,
    paddingBottom: 100,
  },
  produto: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    width: '90%',
    marginLeft: '5%',
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    height: 120,
    borderWidth: 1,
    borderColor: 'white',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150, 
    paddingBottom: 100,
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