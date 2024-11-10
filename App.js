import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'; 
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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Carte') {
            iconName = 'map';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profil') {
            iconName = 'user';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Adresses') {
            iconName = 'list';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Ajouter') {
            iconName = 'add-circle';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Profil" component={UserProfile} />
      <Tab.Screen name="Adresses" component={AddressList} />
      <Tab.Screen name="Ajouter" component={AddAddress} />
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