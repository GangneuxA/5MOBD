import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Importer les icônes d'Expo

export default function HomeScreen({ navigation }) {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(firebase, signUpEmail, signUpPassword);
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
      <Ionicons name="home" size={70} color="black" />
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={signUpEmail}
          onChangeText={setSignUpEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={signUpPassword}
          onChangeText={setSignUpPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Inscription" onPress={handleSignUp} />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={signInEmail}
          onChangeText={setSignInEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={signInPassword}
          onChangeText={setSignInPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Connexion" onPress={handleSignIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  formContainer: {
    flex: 1,
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});