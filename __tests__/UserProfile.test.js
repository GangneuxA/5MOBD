import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserProfile from '../pages/UserProfile';
import { UserContext } from '../context/UserContext';
import { getAuth, updateEmail, updatePassword, signOut, updateProfile } from 'firebase/auth';
import { storage } from '../config/firebaseConfig';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: '123', email: 'test@example.com', displayName: 'Test User' },
  })),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('mockDownloadUrl')),
  uploadBytesResumable: jest.fn(() => ({
    on: jest.fn((_, __, onComplete) => onComplete()),
    snapshot: { ref: { getDownloadURL: jest.fn(() => Promise.resolve('mockDownloadUrl')) } },
  })),
}));

describe('<UserProfile />', () => {
  const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
  const mockSetUser = jest.fn();

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
        <UserProfile navigation={{ navigate: jest.fn() }} />
      </UserContext.Provider>
    );

    expect(getByText('Pseudo : Test User')).toBeTruthy();
    expect(getByText('Email : test@example.com')).toBeTruthy();
    expect(getByPlaceholderText('Nouveau Pseudo')).toBeTruthy();
    expect(getByPlaceholderText('Nouvel Email')).toBeTruthy();
    expect(getByPlaceholderText('Nouveau Mot de Passe')).toBeTruthy();
  });

  it('updates email', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
        <UserProfile navigation={{ navigate: jest.fn() }} />
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Nouvel Email'), 'new@example.com');
    fireEvent.press(getByText('Mettre à jour l\'Email'));

    expect(updateEmail).toHaveBeenCalledWith(expect.any(Object), 'new@example.com');
  });

  it('updates password', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
        <UserProfile navigation={{ navigate: jest.fn() }} />
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Nouveau Mot de Passe'), 'newpassword');
    fireEvent.press(getByText('Mettre à jour le Mot de Passe'));

    expect(updatePassword).toHaveBeenCalledWith(expect.any(Object), 'newpassword');
  });

  it('signs out user', async () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
        <UserProfile navigation={{ navigate }} />
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Déconnexion'));

    expect(signOut).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(navigate).toHaveBeenCalledWith('Home');
  });
});