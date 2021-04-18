import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Welcome from './components/Screens/Welcome'
import Login from './components/Screens/Login'
import ViewSoil from './components/Services/viewSoil';
import AdminSoil from './components/Services/adminSoil';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle:{
            backgroundColor: '#00ff7f'
          },
          headerTintColor: '#ffffff'
        }}
      > 
        <Stack.Screen name = "Welcome" component = {Welcome}/>
        <Stack.Screen name = "Login" component = {Login}/>
        <Stack.Screen name = "View Soil" component = {ViewSoil}/>
        <Stack.Screen name = "Manage Soil" component = {AdminSoil}/>
        
      </Stack.Navigator>
      </NavigationContainer>    
  );
}


