import React from 'react';
import {View,Text,Dimensions,StyleSheet,TouchableOpacity} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const chartConfig = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(255,255,0,${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}
const data = {
    labels: ["Brightness"],
    data: [0.65],
}
const data2 = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [
        {
            data: [65,70,85,80,75,55,75]
        }
    ]
};
export default function App({navigation}){
    return(
        <View style = {styles.container}>
            <ProgressChart
                data = {data}
                width = {screenWidth}
                height = {screenHeight/3.5}
                strokeWidth = {10}
                radius = {50}
                chartConfig = {chartConfig}
                hideLegend = {false}
            />
            
            <LineChart
                data = {data2}
                width = {screenWidth}
                height = {screenHeight/3.5}
                strokeWidth = {5}
                chartConfig = {chartConfig}
            />
        <TouchableOpacity style = {styles.button}>
            <Text style = {styles.text}> PDF Report </Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
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
    },
    text1: {
        color:'#ffffff'
    }
})