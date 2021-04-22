import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions} from 'react-native';
import {ProgressChart,BarChart} from 'react-native-chart-kit'

const chartConfig1 = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}

const chartConfig2 = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0,0,255,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}

const data1 = {
    labels: "Soil",
    data: [0.65]
}

const data2 = {
    labels: 'Air humidity',
    data: [0.8]
}

const data3 = {
    datasets: [
        {
            data: [65,70,85,80,75,55,75]
        }
    ]
}

const data4 = {
    datasets: [
        {
            data: [65,70,85,80,75,55,75]
        }
    ]
}


const screenWidth = Dimensions.get("window").width;

export default function App({navigation}){
    return(
        <View style = {styles.container}>
        <View style = {styles.progressContainer}>
        <ProgressChart
            data = {data1}
            width = {screenWidth/2}
            height = {220}
            strokeWidth = {16}
            radius = {40}
            chartConfig = {chartConfig1}
            hideLegend = {false}
        />
        <ProgressChart
            data = {data2}
            width = {screenWidth/2}
            height = {220}
            strokeWidth = {16}
            radius = {40}
            chartConfig = {chartConfig2}
            hideLegend = {false}
        />
        </View>
        <View style = {styles.barContainer}>
        <BarChart
            data = {data3}
            width = {screenWidth/2}
            height = {220}
            chartConfig = {chartConfig1}
            verticalLabelRotation = {30}
        />
        <BarChart
            data = {data4}
            width = {screenWidth/2}
            height = {220}
            chartConfig = {chartConfig2}
            verticalLabelRotation = {30}
        />
        </View>
        
        <TouchableOpacity style = {styles.button}>
            <Text style = {styles.text}> PDF Report </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.button} onPress = {() => navigation.openDrawer()}>
            <Text style = {styles.text}> Menu </Text>
        </TouchableOpacity>
    </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressContainer: {
        flexDirection: 'row',
    },
    barContainer: {
        flexDirection: 'row',
        
    },
    button: {
        backgroundColor: 'indigo',
        height: 40,
        width: 110,
        borderRadius: 30,
        justifyContent: 'center',
        marginTop: 10
    },
    text: {
        color: '#ffffff',
        textAlign: 'center',
    }
})