import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// import {AppStateContext} from '../../App';
// import {AirMonitor,  MqttClient, SoilMonitor, LightMonitor,} from '../mqtt';

export default function App({navigation}){
    const [minTemp,setminTemp] = useState(32);
    const [maxTemp,setmaxTemp] = useState(37);
    const [minSoil,setminSoil] = useState(65);
    const [maxSoil,setmaxSoil] = useState(70);
    const [minAtmosphere,setminAtmos] = useState(65);
    const [maxAtmosphere,setmaxAtmos] = useState(70);

    return (
        <View style = {styles.container}>
            <Text style={styles.text}>Condition</Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.text}>Temperature</Text>
                <TextInput
                    placeholder = 'Min temperature'
                    placeholderTextColor = 'grey'
                    value = {minTemp}
                    onChangeText = {setminTemp}
                    style={styles.userInput}
                />
                <TextInput
                    placeholder = 'Max temperature'
                    placeholderTextColor = 'grey'
                    value = {maxTemp}
                    onChangeText = {setmaxTemp}
                    style={styles.userInput}
                />
            </View>
            <View style = {{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.text}>Soil Humidity</Text>
                <TextInput
                    placeholder = 'Min humidity'
                    placeholderTextColor = 'grey'
                    value = {minSoil}
                    onChangeText = {setminSoil}
                    style={styles.userInput}
                />
                <TextInput
                    placeholder = 'Max humidity'
                    placeholderTextColor = 'grey'
                    value = {maxSoil}
                    onChangeText = {setmaxSoil}
                    style={styles.userInput}
                />
            </View>
            <View style = {{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.text}>Atmosphere Humidity</Text>
                <TextInput
                    placeholder = 'Min humidity'
                    placeholderTextColor = 'grey'
                    value = {minAtmosphere}
                    onChangeText = {setminAtmos}
                    style={styles.userInput}
                />
                <TextInput
                    placeholder = 'Max humidity'
                    placeholderTextColor = 'grey'
                    value = {maxAtmosphere}
                    onChangeText = {setmaxAtmos}
                    style={styles.userInput}
                />
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity style = {styles.button}>
                <Text style = {styles.text1}> Set </Text>
                </TouchableOpacity>

                <TouchableOpacity style = {styles.button} onPress = {reset}>
                <Text style = {styles.text1}> Reset </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
    function reset(){
        setMinTemp(32);
        setMaxTemp(37);
        setMinSoil(65);
        setMaxSoil(70);
        setMinAtmosphere(65);
        setMaxAtmosphere(70);
    }
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
        marginTop: 10,
        marginLeft:20
    },
    text: {
        color: 'grey',
        textAlign: 'center',
        margin: 10
    },
    text1:{
        color:'#ffffff',
        textAlign:'center'
    },
    userInput:{
        borderColor:'green',
        borderWidth:1,
        margin:5,
        color:'grey'
    }
})