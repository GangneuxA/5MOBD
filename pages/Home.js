import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebase } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 
import Entypo from '@expo/vector-icons/Entypo';

export default function HomeScreen({ navigation }) {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebase, signUpEmail, signUpPassword);
      const user = userCredential.user;
      await updateProfile(user, { displayName: signUpUsername });
      navigation.navigate('Main');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(firebase, signInEmail, signInPassword);
      navigation.navigate('Main');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Inscription</Text>
        <TextInput
          placeholder="Pseudo"
          value={signUpUsername}
          onChangeText={setSignUpUsername}
          style={styles.input}
          placeholderTextColor="black"
        />
        <TextInput
          placeholder="Email"
          value={signUpEmail}
          onChangeText={setSignUpEmail}
          style={styles.input}
          placeholderTextColor="black"
        />
        <TextInput
          placeholder="Mot de passe"
          value={signUpPassword}
          onChangeText={setSignUpPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="black"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Ionicons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Connexion</Text>
        <TextInput
          placeholder="Email"
          value={signInEmail}
          onChangeText={setSignInEmail}
          style={styles.input}
          placeholderTextColor="black"
        />
        <TextInput
          placeholder="Mot de passe"
          value={signInPassword}
          onChangeText={setSignInPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="black"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Ionicons name="log-in" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Entypo name="address" size={150} color="black" style={styles.icon} />
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
  icon: {
    marginTop: 20, 
  },
  formContainer: {
    width: '80%', 
    marginBottom: 20, 
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
});