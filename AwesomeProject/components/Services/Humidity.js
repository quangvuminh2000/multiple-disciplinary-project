import React, {useContext, useEffect, useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,SafeAreaView,ScrollView,FlatList,Image,SectionList} from 'react-native';
import {LineChart} from 'react-native-chart-kit'
import ProgressCircle from 'react-native-progress-circle';
import { AppStateContext } from '../../App';
import { SoilMonitor,MqttClient,AirMonitor } from '../mqtt';
import emitter from 'tiny-emitter/instance';

const chartConfig3 = {
    backgroundGradientFrom: '#353c57',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#353c57',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0,200,170,${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}

const chartConfig4 = {
    backgroundGradientFrom: '#353c57',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#353c57',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(4,217,255,${opacity})`,
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
        source: require('./soilsensor.jpg')
    },
    
    {
        id: "3",
        title: "Water Pumper",
        source: require('./pump.jpg')
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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const MqttObj = useContext(AppStateContext);
    const database = MqttObj.database;

    const [val1,setVal1] = useState(database.soil);
    const [val2,setVal2] = useState(database.air);
    const [per1,setPercent1] = useState(database.soil[database.soil.length - 1]);
    const [per2,setPercent2] = useState(database.air[database.air.length - 1]);

    useEffect(() => {
        const callback = (dataType, data) => {
            if (dataType === 'soil') {
                setPercent1(data);
            } else if (dataType === 'air') {
                setPercent2(data);
            }
        };
        emitter.on('sensorDataReceived', callback);
        return () => emitter.off('sensorDataReceived', callback);
    }, []);
    useEffect(() => {
        const callback = (table, data) => {
            if (table === 'soil') {
                setVal1(data);
            } else if (table === 'air') {
                setVal2(data);
            }
        };
        emitter.on('databaseFetched', callback);
        return () => emitter.off('databaseFetched', callback);
    }, []);

    const data3 = { 
        labels: ["20'","15'","10'","5'","Now"],
        datasets: [
            {
                data: val1,
                strokeWidth: 4.5
            }
          ],
        legend:["Soil moisture"]
      }
    const data4 = {
        labels: ["20'","15'","10'","5'","Now"],
        datasets: [
            {
                data: val2,
                strokeWidth: 4.5
            },
        ],
        legend:["Atmosphere moisture"]
        
    }
    
    return(
        <SafeAreaView style = {styles.container}>
        
        <View style = {styles.progressContainer}>
        <View style={styles.soilProgress}>
        <ProgressCircle
                percent={per1}
                radius={50}
                borderWidth={8}
                color={`rgba(0,200,170,255)`}
                shadowColor="#999"
                bgColor={'#20222f'}
        >
        <Text style={{color:`rgba(0,200,170,255)`}}>{ per1 + '%'}</Text>  
        </ProgressCircle>
        <Text style={{color:`rgba(0,200,170,255)`,marginTop:10}}>Soil moisture</Text>
        </View>
        <View style = {styles.airProgress}>
        <ProgressCircle
                percent={per2}
                radius={50}
                borderWidth={8}
                color={'#04d9ff'}
                shadowColor="#999"
                bgColor={'#20222f'}
        >
        <Text style={{color:'#04d9ff'}}>{per2 + '%'}</Text>  
        </ProgressCircle>
        <Text style={{color:'#04d9ff',marginTop:10}}>Atmosphere moisture</Text>
        </View>
        </View>
        <Text style={{color:'lightgrey',marginBottom:10,fontWeight:'bold'}}>
            ____________________________________________________
        </Text>
        <View style = {styles.lineContainer}>
        <ScrollView horizontal={true}>
            <LineChart
                data = {data3}
                width = {screenWidth/1.1}
                height = {screenHeight/3.8}
                chartConfig = {chartConfig3}
                verticalLabelRotation = {30}
                style = {styles.lineBackGround1}
            />
            <LineChart
                data = {data4}
                width = {screenWidth/1.1}
                height = {screenHeight/3.8}
                chartConfig = {chartConfig4}
                verticalLabelRotation = {30}
                style = {styles.lineBackGround2}
            />
        </ScrollView>
        </View>
        <Text style={styles.text}>Devices</Text>
        <Text style={{color:'lightgrey',marginTop:-10,fontWeight:'bold'}}>
            ____________________________________________________
        </Text>
        <View style={styles.devices}>
        <FlatList
           data={data}
           renderItem={renderItem}
           keyExtractor={(item) => item.id}
        />
        </View>
        
    </SafeAreaView>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#20222f'
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor:'#20222f'
    },
    lineContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'green',
        height: 40,
        width: 110,
        borderRadius: 30,
        justifyContent: 'center',
        marginTop: 10
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
        justifyContent:'center',
        marginRight:40
    },
    text:{
        fontSize: 20,
        color: 'cyan',
    },
    devices:{
        flex: 1,
        width:screenWidth/1.1
    },
    item:{
        backgroundColor:'#353c57',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row',
        borderRadius:10
    },
    title:{
        fontSize: 20,
        marginLeft:10,
        color:'cyan'
    },
    separator:{
        marginVertical: 8,
        borderBottomColor: 'azure',
        borderBottomWidth: 10,
        marginBottom: 15
    },
    lineBackGround1:{
        borderRadius:25,
        marginLeft:40,
        marginRight:20
    },
    lineBackGround2:{
        borderRadius:25,
        marginLeft:10,
        marginRight:15
    }
})
