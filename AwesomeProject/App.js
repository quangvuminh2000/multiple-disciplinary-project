import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button,Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Container,Content,Header,Left,Body} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Welcome from './components/Screens/welcome'
import Devices from './components/Services/Devices';
import Humidity from './components/Services/Humidity';
import Temperature from './components/Services/temperature';
import viewLight from './components/Services/viewLight';
import Settings from './components/Screens/settings';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer(){
  return(
    <Drawer.Navigator
        drawerStyle = {{
            backgroundColor:`rgba(33,35,39,255)`
        }}
        drawerContentOptions = {{
            activeTintColor: '#ffffff',
            inactiveTintColor: '#ffffff',
            activeBackgroundColor: `rgba(0,200,170,255)`,

        }}
    > 
        <Drawer.Screen name = "Home" component = {Welcome} options = {{drawerLabel:'Home',
                                                                       headerShown:true,
                                                                       headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                       drawerIcon: ({tintColor}) => (
                                                                       <Image 
                                                                          source={require('./home1.png')}
                                                                          style={[styles.icon,{tintColor:tintColor}]}
                                                                      />)
                                                                      }}
        />
        <Drawer.Screen name = "Humidity" component = {Humidity} options = {{drawerLabel:'Humidity',         
                                                                            headerShown:true,
                                                                            headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                            drawerIcon: ({tintColor}) => (
                                                                              <Image 
                                                                                 source={require('./humid3.png')}
                                                                                 style={[styles.icon,{tintColor:tintColor}]}
                                                                             />)
                                                                          }}
        />
        <Drawer.Screen name = "Temperature" component = {Temperature} options = {{drawerLabel: 'Temperature',
                                                                                  headerShown:true,
                                                                                  headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                                  drawerIcon: ({tintColor}) => (
                                                                                    <Image 
                                                                                       source={require('./temp1.png')}
                                                                                       style={[styles.icon,{tintColor:tintColor}]}
                                                                                   />)
                                                                                }}
        />
        <Drawer.Screen name = "Brightness" component = {viewLight} options = {{drawerLabel: 'Brightness',
                                                                              headerShown:true,
                                                                              headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                              drawerIcon: ({tintColor}) => (
                                                                                <Image 
                                                                                   source={require('./light1.png')}
                                                                                   style={[styles.icon,{tintColor:tintColor}]}
                                                                               />)
                                                                              }}
        />
        <Drawer.Screen name = "Devices" component = {Devices} options = {{drawerLabel: 'Devices',headerShown:true,headerStyle:{backgroundColor:`rgba(0,200,170,255)`}}}/>
        <Drawer.Screen name = "Settings" component = {Settings} options = {{drawerLabel: 'Settings',headerShown:true,headerStyle:{backgroundColor:`rgba(0,200,170,255)`}}}/>        
      </Drawer.Navigator>
  )
}

export default function App() {
  return (
      <NavigationContainer>
        <MyDrawer/>
      </NavigationContainer>    
  );
}
const styles = StyleSheet.create({
  icon:{
    width: 30,
    height: 30,
    borderRadius:12
  }
  
})
