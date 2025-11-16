import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const produtosNoCarrinho = [
  { id: '1', title: 'Monitor Gamer', price: 79.90, image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg', quantity: 1 },
  { id: '2', title: 'Teclado Mecânico', price: 299.90, image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', quantity: 2 },
];

const total = produtosNoCarrinho.reduce((acc, item) => acc + (item.price * item.quantity), 0);

export default function CartScreen({ navigation }) {

  const renderItem = ({ item }) => (
    <View style={styles.produtoItem}>
      <Image source={{ uri: item.image }} style={styles.imagem} />
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.preco}>R$ {item.price.toFixed(2)}</Text>
        <View style={styles.quantidadeContainer}>
          <TouchableOpacity style={styles.botaoQuantidade}>
            <Ionicons name="remove-circle" size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.quantidadeTexto}>{item.quantity}</Text>
          <TouchableOpacity style={styles.botaoQuantidade}>
            <Ionicons name="add-circle" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.botaoLixeira}>
        <Ionicons name="trash-outline" size={24} color="#db4437" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.topo}>
        <View style={styles.alinhamento}>
          <TouchableOpacity 
            style={styles.botaoVoltar} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={30} color="#6366f1" />
          </TouchableOpacity>

          <View style={styles.tituloContainer}>
            <Ionicons name="cart" style={styles.iconeTopo} />
            <Text style={styles.titulo}>Meu Carrinho</Text>
          </View>

          <View style={styles.botaoVoltar} /> 
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={produtosNoCarrinho}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.carrinhoVazio}>
              <Text style={styles.carrinhoVazioTexto}>Seu carrinho está vazio.</Text>
            </View>
          }
        />

        <View style={styles.resumoContainer}>
          <Text style={styles.resumoTexto}>Total: R$ {total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.botaoCheckout}>
            <Text style={styles.botaoTexto}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
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
    height: 90,
    backgroundColor: '#121212',
    justifyContent: 'center',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 30,
  },
  alinhamento: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '100%',
  },
  botaoVoltar: {
    width: 40,
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeTopo: {
    color: "#6366f1",
    fontSize: 30,
    marginRight: 10,
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1, // <<<--- AQUI ESTÁ A CORREÇÃO
    backgroundColor: '#121212',
  },
  lista: {
    paddingTop: 100,
    paddingBottom: 150,
  },
  produtoItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    width: '90%',
    marginLeft: '5%',
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    height: 130,
    borderWidth: 1,
    borderColor: '#333',
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
    justifyContent: 'space-between',
    height: '100%',
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
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  botaoQuantidade: {
    padding: 5,
  },
  quantidadeTexto: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
  botaoLixeira: {
    padding: 10,
  },
  carrinhoVazio: {
    alignItems: 'center',
    marginTop: 50,
  },
  carrinhoVazioTexto: {
    color: '#9ca3af',
    fontSize: 16,
  },
  resumoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e1e1e',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
  },
  resumoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botaoCheckout: {
    backgroundColor: '#6366f1',
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});