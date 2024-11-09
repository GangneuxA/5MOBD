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
      userId: user.uid,
    };
    await addAddress(newAddress);
    setName('');
    setDescription('');
    setIsPublic(false);
    setPhoto(null);
    navigation.navigate('Addresses'); // Rediriger vers la liste des adresses
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your gallery to choose an image.');
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
      console.error('Error picking image: ', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
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
          throw new Error('Network response was not ok');
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
            console.error('Error uploading image: ', error);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('url ok...');
            setPhoto(url);
            console.log('photo ok...');
            Alert.alert('Success', 'Your address photo has been uploaded!');
          }
        );
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
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