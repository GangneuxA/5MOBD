import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { getAuth, updateEmail, updatePassword, signOut, updateProfile } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../context/UserContext';

export default function UserProfile({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(user?.displayName || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
      getDownloadURL(profilePicRef)
        .then((url) => setProfilePicture(url))
        .catch(() => setProfilePicture(null));
    }
  }, [user]);

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(auth.currentUser, email);
      console.log('Email mis à jour!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(auth.currentUser, password);
      console.log('Mot de passe mis à jour!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: username });
      console.log('Pseudo mis à jour!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
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
      console.error('Error picking image: ', error);
      Alert.alert('Erreur', 'Échec de la sélection de l\'image. Veuillez réessayer.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (user) {
        console.log('Uploading image...');
        const reference = ref(storage, `profilePictures/${user.uid}`);
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
            Alert.alert('Erreur', 'Échec du téléchargement de l\'image. Veuillez réessayer.');
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('url ok...');
            setProfilePicture(url);
            console.log('profil picture ok...');
            setIsEditing(false); 
            Alert.alert('Succès', 'Votre photo de profil a été mise à jour!');
          }
        );
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Erreur', 'Échec du téléchargement de l\'image. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
      {isEditing && <Button title="Changer la photo de profil" onPress={pickImage} />}
      {!isEditing && (
        <>
          <Text style={styles.infoText}>Pseudo : {username}</Text>
          <Text style={styles.infoText}>Email : {email}</Text>
        </>
      )}
      {isEditing && (
        <>
          <TextInput
            placeholder="Nouveau Pseudo"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <Button title="Mettre à jour le Pseudo" onPress={handleUpdateUsername} />
          <TextInput
            placeholder="Nouvel Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Button title="Mettre à jour l'Email" onPress={handleUpdateEmail} />
          <TextInput
            placeholder="Nouveau Mot de Passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Mettre à jour le Mot de Passe" onPress={handleUpdatePassword} />
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.buttonText}>{isEditing ? 'Annuler' : 'Modifier le Profil'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  signOutButton: {
    marginTop: 10, 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});