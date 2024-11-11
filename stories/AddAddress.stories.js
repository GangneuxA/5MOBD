import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import AddAddress from '../pages/AddAddress';
import { AddressProvider } from '../context/AddressContext';
import { UserProvider } from '../context/UserContext';

storiesOf('AddAddress', module)
  .addDecorator((story) => (
    <UserProvider>
      <AddressProvider>
        <View style={{ flex: 1, padding: 16 }}>{story()}</View>
      </AddressProvider>
    </UserProvider>
  ))
  .add('default', () => <AddAddress navigation={{ navigate: () => {} }} />);