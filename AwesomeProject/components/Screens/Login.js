import React, {useState} from 'react';
import {Text,View,TextInput,TouchableOpacity,StyleSheet,Image, SafeAreaView,Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';


const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

export default function App({navigation}){
    const [username, setUser] = useState();
    const [password, setPass] = useState();

    return(
        <SafeAreaView style={{flex:1}}>
            <View style = {styles.container}>
                <Image  source = {require('./pap-logo.png')}
                        style = {{width:100,height:100}}/>
                <Text style = {styles.title}>Automated Care-Taking Gardening System</Text>
                <View style = {styles.loginSec}>
                    <Icon
                        name = 'user-circle'
                        type = 'font-awesome-5'
                        color = 'black'         
                        style = {styles.loginIcon}
                    />
                    <TextInput
                        placeholder = {'Username'}
                        placeholderTextColor = {'black'}
                        //secureTextEntry = {true}
                        onChangeText = {setUser}
                        value = {username}
                        style = {styles.userInput1}
                        autoCapitalize = "none"
                        underlineColorAndroid = "transparent"
                    />
                </View>
                
                <View style = {styles.loginSec}>
                    <Icon
                        name = 'lock'
                        type = 'font-awesome-5'
                        color = 'black'         
                        style = {styles.loginIcon}
                    />
                    <TextInput
                        placeholder = {'Password'}
                        placeholderTextColor = {'black'}
                        secureTextEntry = {true}
                        onChangeText = {setPass}
                        value = {password}
                        style = {styles.userInput2}
                    />
                </View>
                
                
                <TouchableOpacity style = {styles.loginBtn} onPress = {validation}>
                    <Text style = {styles.text}> Login </Text>
                </TouchableOpacity>

                <TouchableOpacity style = {styles.forgetBtn} onPress = {() => {navigation.navigate("Forget")}}>
                    <Text style = {styles.text}> Forget password ?</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>   
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
        backgroundColor:  'black'
    },
    title: {
        color:`rgba(0,200,170,255)`,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "bold"
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
    userInput1: {
        backgroundColor: `rgba(0,200,170,255)`,
        height: 40,
        width: 295,
        borderRadius: 25,
        flex:1
    },
    userInput2: {
        backgroundColor: `rgba(0,200,170,255)`,
        height: 40,
        width: 295,
        borderRadius: 25,
        flex:1
    },
    loginBtn: {
        backgroundColor: 'green',
        marginTop: 30,
        height: 40,
        width: 80,
        borderRadius: 25
    },
    loginIcon: {
        padding: 11,
        height: 47,
        width: 46,
        resizeMode: 'stretch'
    },
    loginSec:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `rgba(0,200,170,255)`,
        height: 50,
        borderRadius: 5,
        width: screenWidth/1.1,
        margin: 10,
    },
    forgetBtn:{
        backgroundColor: 'indigo',
        marginTop: 20,
        height: 40,
        width: 130,
        borderRadius: 25
    }
});