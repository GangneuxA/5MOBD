import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddressList from '../pages/AddressList';
import { AddressContext } from '../context/AddressContext';
import { UserContext } from '../context/UserContext';

describe('<AddressList />', () => {
  const mockAddresses = [{ id: '1', name: 'Test Address', description: 'Test Description', photo: 'mockPhotoUrl', username: 'Test User' }];
  const mockPublicAddresses = [{ id: '2', name: 'Public Address', description: 'Public Description', photo: 'mockPhotoUrl', username: 'Public User' }];
  const mockDeleteAddress = jest.fn();
  const mockUser = { uid: '123', displayName: 'Test User' };

  it('renders correctly', () => {
    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <AddressContext.Provider value={{ addresses: mockAddresses, publicAddresses: mockPublicAddresses, deleteAddress: mockDeleteAddress }}>
          <AddressList navigation={{ navigate: jest.fn() }} />
        </AddressContext.Provider>
      </UserContext.Provider>
    );

    expect(getByText('Mes Adresses')).toBeTruthy();
    expect(getByText('Adresses Publiques')).toBeTruthy();
    expect(getByText(mockAddresses[0].name)).toBeTruthy();
    expect(getByText(mockPublicAddresses[0].name)).toBeTruthy();
  });

  it('deletes an address', async () => {
    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <AddressContext.Provider value={{ addresses: mockAddresses, publicAddresses: mockPublicAddresses, deleteAddress: mockDeleteAddress }}>
          <AddressList navigation={{ navigate: jest.fn() }} />
        </AddressContext.Provider>
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Supprimer'));

    expect(mockDeleteAddress).toHaveBeenCalledWith(mockAddresses[0].id);
  });
});