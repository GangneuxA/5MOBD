import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddAddress from '../pages/AddAddress';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ cancelled: false, assets: [{ uri: 'mockUri' }] })),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('mockDownloadUrl')),
  uploadBytesResumable: jest.fn(() => ({
    on: jest.fn((_, __, onComplete) => onComplete()),
    snapshot: { ref: { getDownloadURL: jest.fn(() => Promise.resolve('mockDownloadUrl')) } },
  })),
}));

describe('<AddAddress />', () => {
  const mockAddAddress = jest.fn();
  const mockUser = { uid: '123', displayName: 'Test User' };

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <AddressContext.Provider value={{ addAddress: mockAddAddress }}>
          <AddAddress navigation={{ navigate: jest.fn() }} />
        </AddressContext.Provider>
      </UserContext.Provider>
    );

    expect(getByPlaceholderText('Nom')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Adresse')).toBeTruthy();
    expect(getByText('Choisir une image depuis la galerie')).toBeTruthy();
    expect(getByText("Ajouter l'adresse")).toBeTruthy();
  });

  it('adds an address', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <AddressContext.Provider value={{ addAddress: mockAddAddress }}>
          <AddAddress navigation={{ navigate: jest.fn() }} />
        </AddressContext.Provider>
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Nom'), 'Test Address');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Test Description');
    fireEvent.changeText(getByPlaceholderText('Adresse'), 'Test Location');
    fireEvent.press(getByText("Ajouter l'adresse"));

    expect(mockAddAddress).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Address',
      description: 'Test Description',
      address: 'Test Location',
      userId: mockUser.uid,
      username: mockUser.displayName,
    }));
  });
});