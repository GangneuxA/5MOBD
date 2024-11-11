import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import AddressList from '../pages/AddressList';
import { AddressProvider } from '../context/AddressContext';
import { UserProvider } from '../context/UserContext';

storiesOf('AddressList', module)
  .addDecorator((story) => (
    <UserProvider>
      <AddressProvider>
        <View style={{ flex: 1, padding: 16 }}>{story()}</View>
      </AddressProvider>
    </UserProvider>
  ))
  .add('default', () => <AddressList navigation={{ navigate: () => {} }} />);