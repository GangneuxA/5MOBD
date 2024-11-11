import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../pages/Home';
import { firebase } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

describe('<HomeScreen />', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    expect(getByPlaceholderText('Pseudo')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Inscription')).toBeTruthy();
    expect(getByText('Connexion')).toBeTruthy();
  });

  it('signs up a user', async () => {
    const navigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={{ navigate }} />);

    fireEvent.changeText(getByPlaceholderText('Pseudo'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');
    fireEvent.press(getByText('Inscription'));

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(firebase, 'test@example.com', 'password');
    expect(updateProfile).toHaveBeenCalledWith(expect.any(Object), { displayName: 'Test User' });
    expect(navigate).toHaveBeenCalledWith('Main');
  });

  it('signs in a user', async () => {
    const navigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={{ navigate }} />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');
    fireEvent.press(getByText('Connexion'));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(firebase, 'test@example.com', 'password');
    expect(navigate).toHaveBeenCalledWith('Main');
  });
});