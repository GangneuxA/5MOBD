import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export default function AddressDetails({ route }) {
  const { address } = route.params;
  const { user } = useContext(UserContext);
  const { comments, fetchComments, addComment } = useContext(AddressContext);
  const [commentText, setCommentText] = useState('');
  const [commentPhoto, setCommentPhoto] = useState(null);

  useEffect(() => {
    fetchComments(address.id);
  }, [address.id]);

  const handleAddComment = async () => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const newComment = {
      addressId: address.id,
      userId: user.uid,
      text: commentText,
      photo: commentPhoto,
      createdAt: new Date(),
    };
    await addComment(newComment);
    setCommentText('');
    setCommentPhoto(null);
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
        const reference = ref(storage, `commentPictures/${user.uid}/${Date.now()}`);
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
            setCommentPhoto(url);
            console.log('comment photo ok...');
            Alert.alert('Success', 'Your comment photo has been uploaded!');
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
      <Text style={styles.addressName}>{address.name}</Text>
      <Text>{address.description}</Text>
      {address.photo && <Image source={{ uri: address.photo }} style={styles.image} />}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text>{item.text}</Text>
            {item.photo && <Image source={{ uri: item.photo }} style={styles.commentImage} />}
          </View>
        )}
      />
      {user.uid !== address.userId && (
        <View style={styles.commentForm}>
          <TextInput
            placeholder="Add a comment"
            value={commentText}
            onChangeText={setCommentText}
            style={styles.input}
          />
          <Button title="Pick an image" onPress={pickImage} />
          {commentPhoto && <Image source={{ uri: commentPhoto }} style={styles.commentImage} />}
          <Button title="Add Comment" onPress={handleAddComment} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addressName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  commentItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentImage: {
    width: 100,
    height: 100,
    marginTop: 8,
  },
  commentForm: {
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});