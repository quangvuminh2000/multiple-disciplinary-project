import React, {useState} from 'react';
import {View,Text,TouchableOpacity} from 'react-native';

export default function App({navigation}){
    return(
        <View>
        <Text>View Soil's Characteristic</Text>
        <TouchableOpacity>
            <Text>Generate PDF</Text>
        </TouchableOpacity>
    </View>
    ) 
}
