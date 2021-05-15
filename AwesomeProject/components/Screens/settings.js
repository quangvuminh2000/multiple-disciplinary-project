import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function App({navigation}){
    const [minTemp,setminTemp] = useState();
    const [maxTemp,setmaxTemp] = useState();
    const [minSoil,setminSoil] = useState();
    const [maxSoil,setmaxSoil] = useState();
    const [minAtmosphere,setminAtmos] = useState();
    const [maxAtmosphere,setmaxAtmos] = useState();
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
        setminTemp()
        setmaxTemp()
        setminSoil()
        setmaxSoil()
        setminAtmos()
        setmaxAtmos()
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