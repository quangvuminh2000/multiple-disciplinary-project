import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button,Image,BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList,DrawerItem} from '@react-navigation/drawer';

import Login from './components/Screens/login';
import Home from './components/Screens/home';
import Devices from './components/Services/Devices';
import Humidity from './components/Services/Humidity';
import Temperature from './components/Services/temperature';
import viewLight from './components/Services/viewLight';
import Forget from './components/Screens/forget';
import SignUp from './components/Screens/signUp';

const Stack = createStackNavigator();
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
                          style={{backgroundColor:`rgba(33,35,39,255)`}}
                          onPress={()=>props.navigation.navigate("Login")}
                          icon={()=><Image source={require('./signout1.png')} style={styles.icon}/>}
                          />
                          
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
        <Drawer.Screen name = "Devices manager" component = {Devices} options = {{drawerLabel: 'Devices manager',
                                                                          headerShown:true,
                                                                          headerStyle:{backgroundColor:`rgba(0,200,170,255)`},
                                                                          drawerIcon: ({tintColor}) => (
                                                                            <Image 
                                                                               source={require('./device.png')}
                                                                               style={[styles.icon,{tintColor:tintColor}]}
                                                                           />)
                                                                          }}
        /> 
      </Drawer.Navigator>
  )
}

function MyStack(){
    return(
      <Stack.Navigator
        screenOptions={{
          headerShown:false
        }}
      >
          <Stack.Screen name = "Login" component = {Login}/>
          <Stack.Screen name = "Forget" component = {Forget}/>
          <Stack.Screen name = "Sign Up" component = {SignUp}/>
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
