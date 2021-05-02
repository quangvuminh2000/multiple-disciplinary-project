import React, {useState} from 'react';
import {Text,View,TextInput,TouchableOpacity,StyleSheet,Image} from 'react-native';


export default function App({navigation}){
    const [isSelected, setSelection] = useState();
    const [username, setUser] = useState();
    const [password, setPass] = useState();
    return(
        <View style = {styles.container}>
        <Image  source = {require('./pap-logo.png')}
                style = {{width:100,height:100}}/>
        <Text style = {styles.title}>Automated Care-Taking Gardening System</Text>
        <TextInput
            placeholder = {'Username'}
            placeholderTextColor = {'black'}
            //secureTextEntry = {true}
            onChangeText = {setUser}
            value = {username}
            style = {styles.userInput}
        />
        <TextInput
            placeholder = {'Password'}
            placeholderTextColor = {'black'}
            secureTextEntry = {true}
            onChangeText = {setPass}
            value = {password}
            style = {styles.userInput}
        />
        
        <TouchableOpacity style = {styles.loginBtn} onPress = {validation}>
            <Text style = {styles.text}> Login </Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.forgetBtn}>
            <Text style = {styles.text}> Forget password ?</Text>
        </TouchableOpacity>

        </View>
    );
    function validation(){
        if(username === 'thanh' && password === '123') {
            navigation.navigate('My App')
        } else {
            alert('Invalid input')
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:  `rgba(33,35,39,255)`
    },
    chBoxContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginRight: 160
    },
    title: {
        color:`rgba(0,200,170,255)`,
        textAlign: 'center',
        fontSize: 30
    },
    text: {
        color: '#ffffff',
        marginTop: 10,
        textAlign: 'center',
        fontSize:14
    },
    text1: {
        marginLeft: 5,
        fontSize: 15
    },
    userInput: {
        backgroundColor: `rgba(0,200,170,255)`,
        height: 40,
        marginTop: 10,
        width: 300,
        borderRadius: 25
    },
    loginBtn: {
        backgroundColor: 'green',
        marginTop: 30,
        height: 40,
        width: 80,
        borderRadius: 25
    },
    forgetBtn:{
        backgroundColor: 'indigo',
        marginTop: 20,
        height: 40,
        width: 130,
        borderRadius: 25
    }
});