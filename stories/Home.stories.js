import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import HomeScreen from '../pages/Home';

storiesOf('HomeScreen', module)
  .addDecorator((story) => (
    <View style={{ flex: 1, padding: 16 }}>{story()}</View>
  ))
  .add('default', () => <HomeScreen navigation={{ navigate: () => {} }} />);