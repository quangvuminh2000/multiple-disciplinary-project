import React from 'react';
import {View, Text, TouchableOpacity,Image, StyleSheet } from 'react-native';
export default function App ({navigation}){
  return(
    <View style={styles.container}>
    <Text style={styles.welcomeText}>Make your garden smarter with ACGS!</Text>
    
    <TouchableOpacity style = {styles.loginBtn} onPress = {() => navigation.openDrawer()}>
            <Text style = {styles.text1}> Menu </Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'powderblue'
  },
  welcomeText: {
    fontSize: 30,
    textAlign: 'center',
    color:'indigo'
  },
  text1: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20
  },
  signupBtn: {
    backgroundColor: 'blueviolet',
    width: 225,
    height: 40,
    borderRadius: 25,
    marginTop: 30,
    justifyContent: 'center'
  },
  loginBtn: {
    backgroundColor: 'blue',
    width: 110,
    height: 45,
    borderRadius: 25,
    marginTop: 20,
    justifyContent: 'center'
  },
  fbBtn: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    height: 40,
    borderRadius: 25,
    width: 200,
    justifyContent: 'center'
  },
  text2: {
    color: '#191970',
    marginTop: 10,
    marginLeft: 50
  },
  photo: {
    width: 30,
    height: 30,
    marginTop: -21,
    marginLeft: 10,
    borderRadius: 10
  }

})