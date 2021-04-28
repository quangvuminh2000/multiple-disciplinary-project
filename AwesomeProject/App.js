import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button,Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList,DrawerItem} from '@react-navigation/drawer';

import Login from './components/Screens/login';
import Welcome from './components/Screens/welcome';
import Home from './components/Screens/home';
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
        drawerContent = {props => {
          return(
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem label={() => <Text style = {{color:'white'}}> Sign out </Text>} 
                          style={{backgroundColor:'blue'}}
                          onPress={()=>props.navigation.navigate("Login")}/>
            </DrawerContentScrollView>
          )
        }}
    > 
        <Drawer.Screen name = "Home" component = {Home} options = {{drawerLabel:'Home',
                                                                       headerShown:true,
                                                                       headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                       drawerIcon: ({tintColor}) => (
                                                                       <Image 
                                                                          source={require('./home12.png')}
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
                                                                                       source={require('./thermo1.png')}
                                                                                       style={[styles.icon,{tintColor:tintColor}]}
                                                                                   />)
                                                                                }}
        />
        <Drawer.Screen name = "Brightness" component = {viewLight} options = {{drawerLabel: 'Brightness',
                                                                              headerShown:true,
                                                                              headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                              drawerIcon: ({tintColor}) => (
                                                                                <Image 
                                                                                   source={require('./bulb1.png')}
                                                                                   style={[styles.icon,{tintColor:tintColor}]}
                                                                               />)
                                                                              }}
        />
        <Drawer.Screen name = "Devices" component = {Devices} options = {{drawerLabel: 'Devices',headerShown:true,headerStyle:{backgroundColor:`rgba(0,200,170,255)`}}}/>
        <Drawer.Screen name = "Settings" component = {Settings} options = {{drawerLabel: 'Settings',
                                                                            headerShown:true,
                                                                            headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                            drawerIcon: ({tintColor}) => (
                                                                              <Image 
                                                                                 source={require('./settings1.png')}
                                                                                 style={[styles.icon,{tintColor:tintColor}]}
                                                                             />)
                                                                          }}/>        
      </Drawer.Navigator>
  )
}

function MyStack(){
    return(
      <Stack.Navigator>
          <Stack.Screen name = "Login" component = {Login}/>
          <Stack.Screen name = "My App" component = {MyDrawer}
                        options = {{headerLeft:() => null}}/>
      </Stack.Navigator>
    )
  }
export default function App() {
  return (
      <NavigationContainer>
        <MyStack/>
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
