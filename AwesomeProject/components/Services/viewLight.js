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
const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255,200,0,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}
const data = {
    labels: ["Brightness"],
    data: [0.65]
}
const data2 = {
    labels: [],
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
                height = {220}
                strokeWidth = {16}
                radius = {40}
                chartConfig = {chartConfig}
                hideLegend = {false}
            />
            <BarChart
                data = {data2}
                width = {screenWidth}
                height = {220}
                chartConfig = {chartConfig}
                verticalLabelRotation = {30}
            />
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
        alignItems: 'center',
        justifyContent: 'center'
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