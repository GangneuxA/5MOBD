import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';

export default function AddressList({ navigation }) {
  const { addresses, publicAddresses, deleteAddress } = useContext(AddressContext);
  const { user } = useContext(UserContext);

  const renderMyAddressItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AddressDetails', { address: item })}>
      <View style={styles.addressItem}>
        <Text style={styles.addressName}>{item.name}</Text>
        <Text>{item.description}</Text>
        {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
        <Button title="Delete" onPress={() => deleteAddress(item.id)} />
      </View>
    </TouchableOpacity>
  );

  const renderPublicAddressItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AddressDetails', { address: item })}>
      <View style={styles.addressItem}>
        <Text style={styles.addressName}>{item.name}</Text>
        <Text>{item.description}</Text>
        {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Addresses</Text>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderMyAddressItem}
      />
      <Text style={styles.sectionTitle}>Public Addresses</Text>
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
});