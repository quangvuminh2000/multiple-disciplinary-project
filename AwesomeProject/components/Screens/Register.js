import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert, SafeAreaView, TextInput,Dimensions, TouchableOpacity } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width
export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const register = async() => {
        setShowLoading(true);
        try {
            const doRegister = await auth().createUserWithEmailAndPassword(email, password);
            setShowLoading(false);
            if(doRegister.user) {
                navigation.navigate('Home');
            }
        } catch (e) {
            setShowLoading(false);
            Alert.alert(
                e.message
            );
        }
    };
    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 28, height: 50 ,color:'lightgray'}}>Register Here!</Text>
            </View>
            <View style={styles.subContainer}>
                <Icon
                    name = 'mail'
                    type = 'feather'
                    color = 'black'         
                    style = {styles.loginIcon}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='Your Email'
                    placeholderTextColor='black'
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <View style={styles.subContainer}>
                <Icon
                    name = 'lock'
                    type = 'font-awesome-5'
                    color = 'black'         
                    style = {styles.loginIcon}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='Your Password'
                    placeholderTextColor='black'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            
                <TouchableOpacity style={styles.regisBtn} onPress={() => register()}>
                <Text style={{fontWeight:'bold'}}>Register</Text>
                </TouchableOpacity>
            
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Already a user?</Text>
            </View>
                <TouchableOpacity style={styles.loginBtn} onPress={() => {navigation.navigate('Login')}}>
                    <Text style={{fontWeight:'bold'}}> Go to login </Text>
                </TouchableOpacity>
            
            {showLoading &&
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            }
    
    </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'black'
    },
    formContainer: {
        height: 400,
        padding: 20
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `rgba(0,200,170,255)`,
        height: 50,
        borderRadius: 5,
        width: screenWidth/1.5,
        margin: 10,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        fontSize: 18,
        margin: 5,
        width: 200
    },
    loginIcon: {
        padding: 11,
        height: 47,
        width: 46,
        resizeMode: 'stretch'
    },
    regisBtn:{
        height:40,
        backgroundColor:'orange',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        width:screenWidth/2.5,
        marginTop:8
    },
    loginBtn:{
        height:40,
        backgroundColor:'aqua',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        width:screenWidth/2.5
    }
})