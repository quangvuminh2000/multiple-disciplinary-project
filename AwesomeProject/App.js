import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Welcome from './components/Screens/Welcome'
import Login from './components/Screens/Login'

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer style = {styles.bigCon}>
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

      </Stack.Navigator>
      </NavigationContainer>    
  );
}

const styles = StyleSheet.create({
    bigCon:{
      alignItems: 'center'

    }
})
