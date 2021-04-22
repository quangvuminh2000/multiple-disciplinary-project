import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Welcome from './components/Screens/welcome'
import Devices from './components/Services/Devices';
import Humidity from './components/Services/Humidity';
import Temperature from './components/Services/temperature';
import viewLight from './components/Services/viewLight';
import Settings from './components/Screens/settings';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
      <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle:{
            backgroundColor: 'coral'
          },
          headerTintColor: 'darkblue'
        }}
        initialRouteName="Home"
      > 
        <Drawer.Screen name = "Home" component = {Welcome}/>
        <Drawer.Screen name = "Humidity" component = {Humidity}/>
        <Drawer.Screen name = "Temperature" component = {Temperature}/>
        <Drawer.Screen name = "Brightness" component = {viewLight}/>
        <Drawer.Screen name = "Devices" component = {Devices}/>
        <Drawer.Screen name = "Settings" component = {Settings}/>        
      </Drawer.Navigator>
      </NavigationContainer>    
  );
}