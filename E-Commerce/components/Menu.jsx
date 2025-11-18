import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Menu({ navigation }) {
  return (
    <View style={styles.menu}>
      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="white" style ={styles.corItem} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('Cart')}
      >
        <Ionicons name="cart" size={24} color="white" style ={styles.corItem} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('DescriptionUser')}
      >
        <Ionicons name="person" size={24} color="white" style ={styles.corItem} />
      </TouchableOpacity>


  
      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('Saller')}
      >                 
        <Ionicons name="storefront" size={24} color="white" style ={styles.corItem} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#1e1e1e',
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    top: '88%'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#6366f1"
  },
  corItem: {
    color: "#6366f1"
  }
});