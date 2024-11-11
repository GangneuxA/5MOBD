import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import MapScreen from '../pages/Map';

storiesOf('MapScreen', module)
  .addDecorator((story) => (
    <View style={{ flex: 1, padding: 16 }}>{story()}</View>
  ))
  .add('default', () => <MapScreen />);