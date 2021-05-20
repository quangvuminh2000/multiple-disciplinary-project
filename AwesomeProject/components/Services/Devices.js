import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,FlatList,Image,SafeAreaView,Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height
const data = [
    {
        id: "1",
        title: "DHT11",
        source: require('./DHT11.jpg')
    },
    
    {
        id: "2",
        title: "Soil Moisture Sensor",
        source: require('./soilsensor.png')
    },
    
    {
        id: "3",
        title: "Light Sensor",
        source: require('./lightsensor.jpg')
    },

    {
        id: "4",
        title: "RC Servo",
        source: require('./servo.jpg')
    },

    {
        id: "5",
        title: "Mini Pump",
        source: require('./pumper.png')
    },

    {
        id: "6",
        title: "Propeller",
        source: require('./soilsensor.png')
    }
]
const Item = ({source,title}) => (
    <View style={styles.item}>
    <Image 
        source={source}
        style={{height:30,width:30}}/>
    <Text style={styles.title}>{title}</Text>
    </View>
);

export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const [devname, setDev] = useState();
    return (
        <SafeAreaView style = {styles.container}>
        
            <View style = {styles.loginSec}>
            <Icon
                name = 'search'
                type = 'font-awesome-5'
                color = 'black'         
                style = {styles.loginIcon}
            />
            <TextInput
                placeholder = {'Search devices'}
                placeholderTextColor = {'black'}
                //secureTextEntry = {true}
                onChangeText = {setDev}
                value = {devname}
                style = {styles.userInput}
                underlineColorAndroid = 'transparent'
            />
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'black'
    },
    button: {
        backgroundColor: 'indigo',
        height: 40,
        width: 110,
        borderRadius: 30,
        justifyContent: 'center',
        marginTop: 10
    },
    item:{
        backgroundColor:`rgba(33,35,39,255)`,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        marginTop: 20,
        flexDirection:'row',
        width: screenWidth/1.15
    },
    title:{
        fontSize: 20,
        marginLeft:10,
        color:'springgreen'
    },
    userInput: {
        backgroundColor: 'grey',
        height: 40,
        width: screenWidth/1.25,
        borderRadius: 25,
        height: screenHeight/14
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
        backgroundColor: 'grey',
        height: 50,
        borderRadius: 5,
        width: screenWidth/1.1,
        height: screenHeight/11.8,
        margin: 10,
    },
})