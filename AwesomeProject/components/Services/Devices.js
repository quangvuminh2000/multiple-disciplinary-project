import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function App({navigation}){
    return (
        <View style = {styles.container}>
            <TouchableOpacity style = {styles.button} onPress = {() => navigation.openDrawer()}>
            <Text style = {styles.text}> Menu </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'indigo',
        height: 40,
        width: 110,
        borderRadius: 30,
        justifyContent: 'center',
        marginTop: 10
    },
    text: {
        color: '#ffffff',
        textAlign: 'center',
    }
})