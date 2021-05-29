import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';
const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height
import { AppStateContext } from '../../App';


export default function App({ navigation }) {



    const MqttObj = useContext(AppStateContext);
    const database = MqttObj.database;

    const [sensorName, setsensorName] = useState([]);
    useEffect(() => {
        database.fetchSensor().then((data) => {
            setsensorName(data);
            console.log("HERE", sensorName);
        })
    }, []);

    //console.log(list)
    //const [devname, setDev] = useState();
    const Images = (text) => {
        switch (text) {
            case "DHT11":
                return require('./DHT11.jpg');
            case "Soil Moisture":
                return require('./soilsensor.jpg');
            case "Light Sensor":
                return require('./lightsensor.jpg');
            case "Relay Circuit":
                return require('./relay.jpg');
            case "Relay Circuit 2":
                return require('./relay.jpg');
            case "RC Servo 590":
                return require('./rc.jpg');
            case "Mini Pump":
                return require('./pump.jpg');
            case "Mini Pump 2":
                return require('./pump.jpg');
            case "DRV Circuit":
                return require('./DRV.jpg');
        }
    }
    const Online = (text) => {
        switch (text) {
            case 0:
                return 'red';
            case 1:
                return 'green';
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={sensorName}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    <View style={styles.item}>
                        <Image
                            source={Images(item.name)}
                            style={styles.photo}
                        />
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: Online(item.online),
                            marginLeft: 15
                        }}

                        />
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#20222f'
    },
    button: {
        backgroundColor: 'indigo',
        height: 40,
        width: 110,
        borderRadius: 30,
        justifyContent: 'center',
        marginTop: 10
    },
    item: {
        flex: 1,
        backgroundColor: '#353c57',
        alignItems: 'center',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        marginTop: 20,
        flexDirection: 'row',
        width: screenWidth / 1.15,
        height: 100,
        borderRadius: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 14,
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        color: 'cyan'
    },
    userInput: {
        backgroundColor: 'grey',
        height: 40,
        width: screenWidth / 1.25,
        borderRadius: 25,
        height: screenHeight / 14
    },
    loginIcon: {
        padding: 11,
        height: 47,
        width: 46,
        resizeMode: 'stretch'
    },
    loginSec: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
        height: 50,
        borderRadius: 5,
        width: screenWidth / 1.1,
        height: screenHeight / 11.8,
        margin: 10,
    },
    image: {
        borderWidth: 1,
        borderColor: 'cyan',
        width: 40,
        height: 40,
        backgroundColor: 'white'
    },
    photo: {
        width: 60,
        height: 60,
        //position:'relative',
        marginRight: 10,
        borderRadius: 30
    }
})
