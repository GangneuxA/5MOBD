import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button } from 'react-native';
import { getAuth, updateEmail, updatePassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export default function UserProfile({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfilePicture(user.uid);
    }
  }, [user]);

  const fetchProfilePicture = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profilePictureUrl = userDoc.data().profilePicture;
        console.log('Fetched profile picture URL:', profilePictureUrl);
        setProfilePicture(profilePictureUrl);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const handleUpdateEmail = () => {
    updateEmail(user, email)
      .then(() => {
        console.log('Email mis à jour!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdatePassword = () => {
    updatePassword(user, password)
      .then(() => {
        console.log('Password mis à jour!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const correctedBlob = blob.slice(0, blob.size, 'image/jpeg'); 
      console.log('Blob created:', correctedBlob);
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const metadata = {
        contentType: 'image/jpeg', 
      };
      await uploadBytes(storageRef, correctedBlob, metadata);
      const url = await getDownloadURL(storageRef);
      console.log('Uploaded image URL:', url);
      setProfilePicture(url);
      await setDoc(doc(db, 'users', user.uid), { profilePicture: url }, { merge: true });
      console.log('Image uploaded and URL set:', url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email: {email}</Text>
      <TextInput
        placeholder="New Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Update Email" onPress={handleUpdateEmail} />
      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />
      {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
      <Button title="Change Profile Picture" onPress={pickImage} />
      <Button title="Sign Out" onPress={handleSignOut} />
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
  },
});