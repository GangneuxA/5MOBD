import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import UserProfile from '../pages/UserProfile';
import { UserProvider } from '../context/UserContext';

storiesOf('UserProfile', module)
  .addDecorator((story) => (
    <UserProvider>
      <View style={{ flex: 1, padding: 16 }}>{story()}</View>
    </UserProvider>
  ))
  .add('default', () => <UserProfile navigation={{ navigate: () => {} }} />);