import React, {useState} from 'react';
import {Text,View,TextInput,TouchableOpacity,CheckBox,StyleSheet} from 'react-native';


export default function App({navigation}){
    const [isSelected, setSelection] = useState();
    const [username, setUser] = useState();
    const [password, setPass] = useState();
    return(
        <View style = {styles.container}>
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
        <View style = {styles.chBoxContainer}>
        <CheckBox
            value = {isSelected}
            onValueChange = {setSelection}
            style = {styles.chBox}
        />
        <Text style = {styles.text1}> Remember me </Text>
        </View>
        <TouchableOpacity style = {styles.loginBtn} onPress = {() => {navigation.navigate('View Soil')}}>
            <Text style = {styles.text}> View Soil </Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.loginBtn} onPress = {() => {navigation.navigate('Manage Soil')}}>
            <Text style = {styles.text}> Manage Soil </Text>
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
    chBoxContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginRight: 160
    },
    title: {
        color:'#00008b',
        textAlign: 'center',
        fontSize: 30
    },
    text: {
        color: '#ffffff',
        marginTop: 10,
        textAlign: 'center'
    },
    text1: {
        marginLeft: 5,
        fontSize: 15
    },
    userInput: {
        backgroundColor: 'orange',
        height: 40,
        marginTop: 10,
        width: 300,
        borderRadius: 25
    },
    loginBtn: {
        backgroundColor: 'indigo',
        marginTop: 30,
        height: 40,
        width: 80,
        borderRadius: 25
    }
});