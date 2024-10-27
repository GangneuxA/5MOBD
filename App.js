import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './pages/Home';
import UserProfile from './pages/UserProfile';
import MapScreen from './pages/Map';
import AddressList from './pages/AddressList';
import AddAddress from './pages/AddAddress';
import AddressDetails from './pages/AddressDetails';
import { UserProvider } from './context/UserContext';
import { AddressProvider } from './context/AddressContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="UserProfile" component={UserProfile} />
      <Tab.Screen name="Addresses" component={AddressList} />
      <Tab.Screen name="AddAddress" component={AddAddress} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AddressProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddressDetails" component={AddressDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </AddressProvider>
    </UserProvider>
  );
}