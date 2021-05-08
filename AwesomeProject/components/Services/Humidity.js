import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,SafeAreaView,ScrollView} from 'react-native';
import {ProgressChart,BarChart,LineChart} from 'react-native-chart-kit'

const chartConfig1 = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}

const chartConfig2 = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0,0,255,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
}

const data1 = {
    labels: "Soil",
    data: [0.65]
}

const data2 = {
    labels: 'Air',
    data: [0.8]
}

const data3 = {
    datasets: [
        {
            data: [40,50,65,60,70,55,75]
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
const screenHeight = Dimensions.get("window").height;

export default function App({navigation}){
    return(
        <SafeAreaView style = {styles.container}>
        <View style = {styles.progressContainer}>
        <ProgressChart
            data = {data1}
            width = {screenWidth/2}
            height = {screenHeight/4.5}
            strokeWidth = {10}
            radius = {50}
            chartConfig = {chartConfig1}
            hideLegend = {false}
        />
        <ProgressChart
            data = {data2}
            width = {screenWidth/2}
            height = {screenHeight/4.5}
            strokeWidth = {10}
            radius = {50}
            chartConfig = {chartConfig2}
            hideLegend = {false}
        />
        </View>
        <View style = {styles.barContainer}>
        <LineChart
            data = {data3}
            width = {screenWidth/2}
            height = {screenHeight/4.5}
            chartConfig = {chartConfig1}
            strokeWidth = {5}
            verticalLabelRotation = {30}
        />
        <LineChart
            data = {data4}
            width = {screenWidth/2}
            height = {screenHeight/4.5}
            chartConfig = {chartConfig2}
            strokeWidth = {5}
            verticalLabelRotation = {30}
        />
        </View>
        
        <TouchableOpacity style = {styles.button}>
            <Text style = {styles.text}> PDF Report </Text>
        </TouchableOpacity>
    </SafeAreaView>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    grContainer:{
        
    }
    ,
    textContainer:{
        flexDirection:'row'
    }
    ,
    progressContainer: {
        flexDirection: 'row',

    },
    barContainer: {
        flexDirection: 'row',
        marginBottom:45
        
    },
    button: {
        backgroundColor: 'green',
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