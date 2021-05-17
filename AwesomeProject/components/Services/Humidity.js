import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,SafeAreaView,ScrollView,FlatList,Image} from 'react-native';
import {LineChart} from 'react-native-chart-kit'
import ProgressCircle from 'react-native-progress-circle';

const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
}

const chartConfig3 = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}

const chartConfig4 = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0,0,255,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
}
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
        title: "Water Pumper",
        source: require('./pumper.png')
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


const data3 = {
    datasets: [
        {
            data: [40,50,65,60,70,55,75],
            strokeWidth: 4.5
        }
    ],
    legend:["Soil moisture"]
}

const data4 = {

    datasets: [
        {
            data: [65,70,85,80,75,55,75],
            strokeWidth: 4.5
        },
    ],
    legend:["Atmosphere moisture"]
    
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    return(
        <SafeAreaView style = {styles.container}>
        <ScrollView>
        <View style = {styles.progressContainer}>
        <View style={styles.soilProgress}>
        <ProgressCircle
                percent={65}
                radius={50}
                borderWidth={8}
                color={'green'}
                shadowColor="#999"
                bgColor={'black'}
        >
        <Text style={{color:'green'}}>{'65%'}</Text>  
        </ProgressCircle>
        <Text style={{color:'green',marginTop:10}}>Soil moisture</Text>
        </View>
        <View style = {styles.airProgress}>
        <ProgressCircle
                percent={75}
                radius={50}
                borderWidth={8}
                color={'blue'}
                shadowColor="#999"
                bgColor={'black'}
        >
        <Text style={{color:'blue'}}>{'75%'}</Text>  
        </ProgressCircle>
        <Text style={{color:'blue',marginTop:10}}>Atmosphere moisture</Text>
        </View>
        </View>

        <Separator/>

        <View style = {styles.lineContainer}>
        <LineChart
            data = {data3}
            width = {screenWidth/2}
            height = {screenHeight/4.5}
            chartConfig = {chartConfig3}
            verticalLabelRotation = {30}
        />
        <LineChart
            data = {data4}
            width = {screenWidth/2}
            height = {screenHeight/4.5}
            chartConfig = {chartConfig4}
            verticalLabelRotation = {30}
        />
        </View>
        
        <Text style={styles.text}>Devices</Text>
        <View style={styles.devices}>
        <FlatList
           data={data}
           renderItem={renderItem}
           keyExtractor={(item) => item.id}
        />
        </View>
        </ScrollView>
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
    progressContainer: {
        flexDirection: 'row',
    },
    lineContainer: {
        flexDirection: 'row',
        marginBottom: 10
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
    soilProgress:{
        marginLeft:50,
        marginRight: 90,
        marginTop:50,
        marginBottom: 20,
        alignItems:'center',
        justifyContent:'center'
    },
    airProgress:{
        marginTop:50,
        marginBottom: 20,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize: 20,
        color:'grey'
    },
    devices:{
        flex: 1
    },
    item:{
        backgroundColor:`rgba(33,35,39,255)`,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row'
    },
    title:{
        fontSize: 20,
        marginLeft:10,
        color:'springgreen'
    },
    separator:{
        marginVertical: 8,
        borderBottomColor: 'azure',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 15
    }
})