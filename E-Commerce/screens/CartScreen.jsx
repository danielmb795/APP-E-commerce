import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../contexts/CartContext';

export default function CartScreen({ navigation }) {
  const { carrinho, removerDoCarrinho } = useCart();

  const total = carrinho.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const renderItem = ({ item }) => (
    <View style={styles.produtoItem}>
      <Image source={{ uri: item.image }} style={styles.imagem} />
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.preco}>R$ {item.price.toFixed(2)}</Text>
        <View style={styles.quantidadeContainer}>
          <Text style={styles.quantidadeLabel}>Qtd:</Text>
          <Text style={styles.quantidadeTexto}>{item.quantity}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.botaoLixeira} 
        onPress={() => removerDoCarrinho(item.id)}
      >
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
          data={carrinho}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.carrinhoVazio}>
              <Ionicons name="cart-outline" size={50} color="#333" />
              <Text style={styles.carrinhoVazioTexto}>Seu carrinho está vazio.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                 <Text style={{color: '#6366f1', marginTop: 10}}>Ir às compras</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {carrinho.length > 0 && (
          <View style={styles.resumoContainer}>
            <Text style={styles.resumoTexto}>Total: R$ {total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.botaoCheckout}>
              <Text style={styles.botaoTexto}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flex: 1,
    backgroundColor: '#121212',
  },
  lista: {
    paddingTop: 100,
    paddingBottom: 150,
  },
  produtoItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    width: '92%',
    marginLeft: '4%',
    marginBottom: 15,
    borderRadius: 12,
    alignItems: 'center',
    padding: 15,
    height: 120,
    borderWidth: 1,
    borderColor: '#333',
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  info: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 5,
  },
  nome: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  preco: {
    marginTop: 5,
    fontSize: 16,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantidadeLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginRight: 5,
  },
  quantidadeTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoLixeira: {
    padding: 10,
  },
  carrinhoVazio: {
    alignItems: 'center',
    marginTop: 100,
  },
  carrinhoVazioTexto: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 10,
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
    borderColor: '#333',
    alignItems: 'center',
  },
  resumoTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    fontWeight: 'bold',
  },
});