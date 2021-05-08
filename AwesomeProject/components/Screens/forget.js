import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput} from 'react-native';

export default function App({navigation}) {
    const [email,setEmail] = useState();
    const [password1,setPass1] = useState();
    const [password2,setPass2] = useState();
    return(
        <View style={styles.container}>
            <Text style = {styles.text}>Reset password</Text>
            <TextInput
                placeholder = {'Email'}
                placeholderTextColor = {'black'}
                onChangeText = {setEmail}
                value = {email}
                style = {styles.userInput1}
                autoCapitalize = "none"
                underlineColorAndroid = "transparent"
            />
            <TextInput
                placeholder = {'New password'}
                placeholderTextColor = {'black'}
                secureTextEntry = {true}
                onChangeText = {setPass1}
                value = {password1}
                style = {styles.userInput1}
                autoCapitalize = "none"
                underlineColorAndroid = "transparent"
            />
            <TextInput
                placeholder = {'Retype password'}
                placeholderTextColor = {'black'}
                secureTextEntry = {true}
                onChangeText = {setPass2}
                value = {password2}
                style = {styles.userInput1}
                autoCapitalize = "none"
                underlineColorAndroid = "transparent"
            />
            <TouchableOpacity style = {styles.subBtn} onPress={verify}>
                <Text style={styles.text1}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
    function verify(){
        if(!(email) || !(password1) || !(password2)) {
            alert('Please fill in all sections !')
        } else {
            if(password1 !== password2) {
                alert('2 passwords are not match')
            }
            else {
                alert('Your password is reset, now login again')
                navigation.navigate('Login')
            }
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        color:'#ffffff',
        fontSize:35
    },
    text1:{
        color:'#ffffff'
    },
    userInput1: {
        backgroundColor: `rgba(0,200,170,255)`,
        height: 40,
        width: 295,
        borderRadius: 25,
        margin: 8
    },
    subBtn:{
        backgroundColor:'indigo',
        width:90,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:25,
        margin:8
    }
})