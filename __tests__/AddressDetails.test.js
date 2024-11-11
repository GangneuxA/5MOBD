import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddressDetails from '../pages/AddressDetails';
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

describe('<AddressDetails />', () => {
  const mockFetchComments = jest.fn();
  const mockAddComment = jest.fn();
  const mockUser = { uid: '123', displayName: 'Test User' };
  const mockAddress = { id: '1', name: 'Test Address', description: 'Test Description', address: 'Test Location', photo: 'mockPhotoUrl' };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <AddressContext.Provider value={{ comments: [], fetchComments: mockFetchComments, addComment: mockAddComment }}>
          <AddressDetails route={{ params: { address: mockAddress } }} />
        </AddressContext.Provider>
      </UserContext.Provider>
    );

    expect(getByText(mockAddress.name)).toBeTruthy();
    expect(getByText(mockAddress.description)).toBeTruthy();
    expect(getByText(mockAddress.address)).toBeTruthy();
    expect(getByPlaceholderText('Ajouter un commentaire')).toBeTruthy();
  });

  it('adds a comment', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <AddressContext.Provider value={{ comments: [], fetchComments: mockFetchComments, addComment: mockAddComment }}>
          <AddressDetails route={{ params: { address: mockAddress } }} />
        </AddressContext.Provider>
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Ajouter un commentaire'), 'Test Comment');
    fireEvent.press(getByText('Ajouter un commentaire'));

    expect(mockAddComment).toHaveBeenCalledWith(expect.objectContaining({
      text: 'Test Comment',
      addressId: mockAddress.id,
      userId: mockUser.uid,
      username: mockUser.displayName,
    }));
  });
});