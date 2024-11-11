import React from 'react';
import { render } from '@testing-library/react-native';
import MapScreen from '../pages/Map';
import * as Location from 'expo-location';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 37.78825, longitude: -122.4324 } })),
}));

describe('<MapScreen />', () => {
  it('renders correctly', async () => {
    const { findByText } = render(<MapScreen />);

    expect(await findByText('My Location')).toBeTruthy();
  });
});