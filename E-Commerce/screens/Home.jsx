import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Menu from '../components/Menu';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const usuario = "UserTeste"

const produtos = [
  { id: '1', nome: 'Monitor Gay', preco: 799.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '2', nome: 'Monitor meio gay', preco: 1299.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '3', nome: 'Monitor muito gay', preco: 459.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '4', nome: 'Monitor gay pra karalho', preco: 1599.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '5', nome: 'Monitfereor 4ewfK', preco: 1899.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '6', nome: 'Monitor Portfrefátil', preco: 699.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '7', nome: 'Monitor Ofrefeffice', preco: 599.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
  { id: '8', nome: 'Monitor Gferfreaming Pro', preco: 2299.90, imagem: 'https://via.placeholder.com/150', categoria: 'Eletrônicos' },
];

export default function Home() {

  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.produto}>
      <View style={styles.imagemContainer}>
        <Image source={{ uri: item.imagem }} style={styles.imagem} />
        <View style={styles.categoriaTag}>
          <Text style={styles.categoriaText}>{item.categoria}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        <View style={styles.avaliacao}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Ionicons name="star" size={16} color="#FFD700" />
          <Ionicons name="star" size={16} color="#FFD700" />
          <Ionicons name="star" size={16} color="#FFD700" />
          <Ionicons name="star-half" size={16} color="#FFD700" />
          <Text style={styles.avaliacaoText}>(128)</Text>
        </View>
        <TouchableOpacity style={styles.botaoComprar}>
          <Text style={styles.botaoComprarText}>Adicionar ao Carrinho</Text>
          <Ionicons name="cart" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.containerGeral}>
      <LinearGradient
        colors={['#0f0f0f', '#1a1a1a']}
        style={styles.topo}
      >
        <View style={styles.alinhamento}>
          <View style={styles.userContainer}>
            <Ionicons name="person-circle" style={styles.user} />
            <View style={styles.userInfo}>
              <Text style={styles.ola}>Olá,</Text>
              <Text style={styles.usuarioNome}>{usuario}</Text>
            </View>
          </View>
          
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Hardware</Text>
            <Text style={styles.subtitulo}>Encontre os melhores produtos</Text>
          </View>

          <TouchableOpacity style={styles.exitButton}
            onPress = {() => navigation.navigate("Login")}
          >
            <MaterialIcons name="exit-to-app" style={styles.exit}/>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.conteudo}>
        <LinearGradient
          colors={['#1a1a1a', '#121212']}
          style={styles.container}
        >
          {/* Se quiser adicionar o statsContainer novamente, descomente abaixo */}
          {/* <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Produtos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12h</Text>
              <Text style={styles.statLabel}>Entrega</Text>
            </View>
          </View> */}

          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </View>
      
      <Menu />
    </View>
  );
}

const styles = StyleSheet.create({
  containerGeral: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topo: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  conteudo: {
    flex: 1,
    marginTop: 0,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  alinhamento: {
    flexDirection: 'row',     
    alignItems: 'center',          
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    width: '100%',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    marginLeft: 10,
  },
  ola: {
    color: '#94a3b8',
    fontSize: 12,
  },
  usuarioNome: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  user: {
    color: "#6366f1",
    fontSize: 40,
  },
  tituloContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titulo: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  exitButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  exit: {
    color: "#6366f1",
    fontSize: 28,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#6366f1',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 10,
  },
  lista: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  produto: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    width: '90%',
    marginLeft: '5%',
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
    padding: 16,
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  imagemContainer: {
    position: 'relative',
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  categoriaTag: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#6366f1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoriaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  info: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preco: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  avaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avaliacaoText: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 6,
  },
  botaoComprar: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  botaoComprarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
});