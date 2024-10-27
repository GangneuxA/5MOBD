import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Image } from 'react-native';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';

export default function AddAddress() {
  const { addAddress } = useContext(AddressContext);
  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleAddAddress = async () => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const newAddress = {
      name,
      description,
      isPublic,
      photo,
      userId: user.uid, // Ajout de l'ID de l'utilisateur
    };
    await addAddress(newAddress);
    setName('');
    setDescription('');
    setIsPublic(false);
    setPhoto(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text>Public</Text>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
        />
      </View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <Button title="Add Address" onPress={handleAddAddress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
});