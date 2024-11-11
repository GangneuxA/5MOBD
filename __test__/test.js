import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../pages/Home';
import { firebase } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';


jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

describe('<HomeScreen />', () => {
  test('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    // Vérifiez que les éléments de texte sont rendus correctement
    getByText('Inscription');
    getByText('Connexion');
    getByPlaceholderText('Pseudo');
    getByPlaceholderText('Email');
    getByPlaceholderText('Mot de passe');
  });

  test('signs in user with email and password', async () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');
    fireEvent.press(getByText('Connexion'));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(firebase, 'test@example.com', 'password');
  });

  test('navigates to Main after sign up', async () => {
    const navigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={{ navigate }} />);

    fireEvent.changeText(getByPlaceholderText('Pseudo'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');
    fireEvent.press(getByText("S'inscrire"));

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(firebase, 'test@example.com', 'password');
    expect(updateProfile).toHaveBeenCalledWith(expect.any(Object), { displayName: 'Test User' });
    expect(navigate).toHaveBeenCalledWith('Main');
  });
});