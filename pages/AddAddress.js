import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Image, Alert } from 'react-native';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export default function AddAddress({ navigation }) {
  const { addAddress } = useContext(AddressContext);
  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleAddAddress = async () => {
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }

    const newAddress = {
      name,
      description,
      address,
      isPublic,
      photo,
      userId: user.uid,
      username: user.displayName,
    };
    await addAddress(newAddress);
    setName('');
    setDescription('');
    setAddress('');
    setIsPublic(false);
    setPhoto(null);
    navigation.navigate('Adresses');
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à votre galerie pour choisir une image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        console.log('Uploading image...' + result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image : ', error);
      Alert.alert('Erreur', 'Échec de la sélection de l\'image. Veuillez réessayer.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (user) {
        console.log('Uploading image...');
        const reference = ref(storage, `addressPictures/${user.uid}/${Date.now()}`);
        console.log('ref ok...');
        const response = await fetch(uri);
        console.log('res ok...');
        if (!response.ok) {
          throw new Error('La réponse réseau n\'était pas correcte');
        }
        const blob = await response.blob();
        console.log('blob ok...');

        const uploadTask = uploadBytesResumable(reference, blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Erreur lors du téléchargement de l\'image : ', error);
            Alert.alert('Erreur', 'Échec du téléchargement de l\'image. Veuillez réessayer.');
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('url ok...');
            setPhoto(url);
            console.log('photo ok...');
            Alert.alert('Succès', 'Votre photo d\'adresse a été téléchargée!');
          }
        );
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image : ', error);
      Alert.alert('Erreur', 'Échec du téléchargement de l\'image. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="black"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholderTextColor="black"
      />
      <TextInput
        placeholder="Adresse"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        placeholderTextColor="black"
      />
      <View style={styles.switchContainer}>
        <Text>Public</Text>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
        />
      </View>
      <Button title="Choisir une image depuis la galerie" onPress={pickImage} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <Button title="Ajouter l'adresse" onPress={handleAddAddress} />
      </View>
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
  buttonContainer: {
    marginTop: 12,
  },
});