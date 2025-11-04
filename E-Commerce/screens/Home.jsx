import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Menu from '../components/Menu';
import Ionicons from '@expo/vector-icons/Ionicons';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const usuario = "UserTeste"

const produtos = [
  { id: '1', nome: 'Monitor', preco: 79.90, imagem: 'https://via.placeholder.com/150' },
  { id: '2', nome: 'Monitor', preco: 299.90, imagem: 'https://via.placeholder.com/150' },
  { id: '3', nome: 'Monitor', preco: 59.90, imagem: 'https://via.placeholder.com/150' },
  { id: '4', nome: 'Monitor', preco: 199.90, imagem: 'https://via.placeholder.com/150' },
  { id: '5', nome: 'Monitor', preco: 79.90, imagem: 'https://via.placeholder.com/150' },
  { id: '6', nome: 'Monitor', preco: 299.90, imagem: 'https://via.placeholder.com/150' },
  { id: '7', nome: 'Monitor', preco: 59.90, imagem: 'https://via.placeholder.com/150' },
  { id: '8', nome: 'Monitor', preco: 199.90, imagem: 'https://via.placeholder.com/150' },
];

export default function Home() {

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.produto}>
      <Image source={{ uri: item.imagem }} style={styles.imagem} />
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
    <View style={styles.topo}>
      <View style={styles.alinhamento}>
      <Ionicons name="person" style={styles.user} />
      <Text style={styles.titulo}>Seja bem vindo {usuario} </Text>
      
      <MaterialIcons name="exit-to-app" style={styles.exit}/>
      </View>
    </View>

    <View style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
      <Menu />
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
    height: 80,
    backgroundColor: '#121212',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2,
  },

  alinhamento: {
    flexDirection: 'row',     
    alignItems: 'center',          
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
  },
  lista: {
    paddingTop: 90,
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
  },
  info: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  preco: {
    marginTop: 5,
    fontSize: 16,
    color: '#fff',
  },
});
