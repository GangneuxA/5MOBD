import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function AddressList({ navigation }) {
  const { addresses, publicAddresses, deleteAddress } = useContext(AddressContext);
  const { user } = useContext(UserContext);

  const renderMyAddressItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AddressDetails', { address: item })}>
      <View style={styles.addressItem}>
        <Text style={styles.addressName}>{item.name}</Text>
        <Text>{item.description}</Text>
        {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAddress(item.id)}>
          <Ionicons name="trash" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPublicAddressItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AddressDetails', { address: item })}>
      <View style={styles.addressItem}>
        <Text style={styles.addressName}>{item.name}</Text>
        <Text>{item.description}</Text>
        {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
        <Text>Posté par : {item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mes Adresses</Text>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderMyAddressItem}
      />
      <Text style={styles.sectionTitle}>Adresses Publiques</Text>
      <FlatList
        data={publicAddresses}
        keyExtractor={(item) => item.id}
        renderItem={renderPublicAddressItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  addressItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addressName: {
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347', 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});