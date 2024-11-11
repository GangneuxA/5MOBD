import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import AddressDetails from '../pages/AddressDetails';
import { AddressProvider } from '../context/AddressContext';
import { UserProvider } from '../context/UserContext';

const mockAddress = {
  id: '1',
  name: 'Test Address',
  description: 'Test Description',
  address: 'Test Location',
  photo: 'mockPhotoUrl',
};

storiesOf('AddressDetails', module)
  .addDecorator((story) => (
    <UserProvider>
      <AddressProvider>
        <View style={{ flex: 1, padding: 16 }}>{story()}</View>
      </AddressProvider>
    </UserProvider>
  ))
  .add('default', () => <AddressDetails route={{ params: { address: mockAddress } }} />);