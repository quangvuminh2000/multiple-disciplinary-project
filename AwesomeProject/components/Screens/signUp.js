import React, { useState } from 'react';
import {View,Text, StyleSheet,TextInput,TouchableOpacity} from 'react-native';

export default function App({navigation}){
    const [email,setEmail] = useState();
    const [phone,setPhone] = useState();
    const [username, setUser] = useState();
    const [password1, setPass1] = useState();
    const [password2, setPass2] = useState();
    return(
        <View style = {styles.container}>
            <Text style={{color:'azure',fontWeight:'bold',fontSize:35,marginBottom:10}}>Sign Up</Text>
            <TextInput
                placeholder = {'Email'}
                placeholderTextColor = {'black'}
                onChangeText = {setEmail}
                value = {email}
                style = {styles.userInput2}
            />
            <TextInput
                placeholder = {'Phone number'}
                placeholderTextColor = {'black'}
                onChangeText = {setPhone}
                value = {phone}
                style = {styles.userInput2}
            />
            <TextInput
                placeholder = {'Username'}
                placeholderTextColor = {'black'}
                onChangeText = {setUser}
                value = {username}
                style = {styles.userInput2}
            />
            <TextInput
                placeholder = {'Password'}
                placeholderTextColor = {'black'}
                secureTextEntry = {true}
                onChangeText = {setPass1}
                value = {password1}
                style = {styles.userInput2}
            />
            <TextInput
                placeholder = {'Retype password'}
                placeholderTextColor = {'black'}
                secureTextEntry = {true}
                onChangeText = {setPass2}
                value = {password2}
                style = {styles.userInput2}
            />
            <TouchableOpacity style={styles.submitBtn} onPress = {checking}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    );
    function checking(){
        if (!(email)|| !(phone) || !(username) || !(password1) || !(password2)){
            alert('Please fill in all section !')
        }
        else {
            if(password1 === password2){
                alert('Register successfully')
                navigation.navigate('Login')
            }
            else {
                alert('2 passwords are not match')
            }
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center'
    },
    userInput2:{
        backgroundColor: `rgba(0,200,170,255)`,
        height: 40,
        width: 295,
        borderRadius: 25,
        margin:8
    },
    submitBtn:{
        height:40,
        width: 100,
        backgroundColor:'red',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    }
})