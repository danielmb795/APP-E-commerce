import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Menu from '../components/Menu';

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.text}>Conteúdo da página</Text>
        <Text style={styles.text}>Role o conteúdo para ver o menu fixo.</Text>
      </ScrollView>
      <Menu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  scroll: {
    paddingBottom: 100,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    margin: 20,
  },
});
