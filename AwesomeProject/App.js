import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Image, BackHandler} from 'react-native';
import Icon from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import Login from './components/Screens/Login';
import Home from './components/Screens/Home';
import Reset from './components/Screens/Reset';
import Register from './components/Screens/Register';
import Devices from './components/Services/Devices';
import Humidity from './components/Services/Humidity';
import Temperature from './components/Services/Temperature';
import viewLight from './components/Services/viewLight';
import tempSettings from './components/Screens/Tab/tempSettings';
import humidSettings from './components/Screens/Tab/humidSettings';
import Settings from './components/Screens/Settings';
import Database from './components/database';

import {
  MqttClient,
  SoilMonitor,
  AirMonitor,
  LightMonitor,
  startForegroundService,
  testClient,
  testClient1,
} from './components/mqtt';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();
function MyTab(){
  return(
    <Tab.Navigator 
    tabBarOptions={{
      bounces: true,
      activeTintColor:'azure',
      pressColor:'azure',
      showIcon:true,
      style:{backgroundColor:'#353c57'},
    }}
    >
      <Tab.Screen 
        name = 'Temperature' 
        component={tempSettings}
        options = {{
          tabBarIcon: ({tintColor}) => (
            <Image
              source={require('./thermo1.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          )
        }}
      />
      <Tab.Screen 
        name = 'Humidity' 
        component={humidSettings}
        options = {{
          tabBarIcon: ({tintColor}) => (
            <Image
              source={require('./humid3.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}
function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: 'rgba(33,35,39,255)',
      }}
      drawerContentOptions={{
        activeTintColor: '#ffffff',
        inactiveTintColor: '#ffffff',
        activeBackgroundColor: 'rgba(0,200,170,255)',
      }}
      drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label={() => <Text style={{color: 'white'}}> Sign out </Text>}
              style={{backgroundColor: 'rgba(33,35,39,255)'}}
              onPress={() => props.navigation.navigate('Login')}
              icon={() => (
                <Image source={require('./signout1.png')} style={styles.icon} />
              )}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: 'Home',
          headerShown: true,
          headerStyle: {backgroundColor: 'rgba(0,200,170,255)'},
          drawerIcon: ({tintColor}) => (
            <Image
              source={require('./home12.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Humidity"
        component={Humidity}
        options={{
          drawerLabel: 'Humidity',
          headerShown: true,
          headerStyle: {backgroundColor: 'rgba(0,200,170,255)'},
          drawerIcon: ({tintColor}) => (
            <Image
              source={require('./humid3.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Temperature"
        component={Temperature}
        options={{
          drawerLabel: 'Temperature',
          headerShown: true,
          headerStyle: {backgroundColor: 'rgba(0,200,170,255)'},
          drawerIcon: ({tintColor}) => (
            <Image
              source={require('./thermo1.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Brightness"
        component={viewLight}
        options={{
          drawerLabel: 'Brightness',
          headerShown: true,
          headerStyle: {backgroundColor: 'rgba(0,200,170,255)'},
          drawerIcon: ({tintColor}) => (
            <Image
              source={require('./bulb1.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Devices Manager"
        component={Devices}
        options={{
          drawerLabel: 'Devices Manager',
          headerShown: true,
          headerStyle: {backgroundColor: 'rgba(0,200,170,255)'},
          drawerIcon: ({tintColor}) => (
            <Image
              source={require('./device.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={MyTab}
        options={{
          drawerLabel: 'Settings',
          headerShown: true,
          headerStyle: {backgroundColor: 'rgba(0,200,170,255)'},
          drawerIcon: ({tintColor}) => (
            <Image
              source={require('./settings1.png')}
              style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Reset" component={Reset} />
      <Stack.Screen
        name="My App"
        component={MyDrawer}
        options={{headerLeft: () => null}}
      />
    </Stack.Navigator>
  );
}

const database = new Database({name: 'test4.db', createFromLocation: '~test4.db'});

export default function App() {
  useEffect(() => {
    database.init();
    return database.cleanup;
  }, []);

  useEffect(() => {
    const callback = () => {
      console.log('Implement callback!');
    }
    client.start(callback);
    return client.stop;
  }, []);

  useEffect(() => {
    testClient1.start();
    return testClient1.stop;
  }, []);

  return (
    <AppStateProvider>
      <NavigationContainer>
        <MyStack/>
      </NavigationContainer>
    </AppStateProvider>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    borderRadius: 12,
  },
});

// const client = new MqttClient();
const client = testClient;
const soilmonitor = new SoilMonitor(client);
const airmonitor = new AirMonitor(client);
const lightmonitor = new LightMonitor(client);

const MqttObj = {
  client: client,
  client1: testClient1,
  soilmonitor: soilmonitor,
  airmonitor: airmonitor,
  lightmonitor: lightmonitor,
  database: database,
}

export const AppStateContext = React.createContext(client);

const AppStateProvider = (props) => {
  return (<AppStateContext.Provider value={MqttObj}>
    {props.children}
    </AppStateContext.Provider>)
}
