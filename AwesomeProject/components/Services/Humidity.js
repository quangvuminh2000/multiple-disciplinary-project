import React, {useContext, useEffect, useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,SafeAreaView,ScrollView,FlatList,Image,SectionList} from 'react-native';
import {LineChart} from 'react-native-chart-kit'
import ProgressCircle from 'react-native-progress-circle';
import emitter from 'tiny-emitter/instance';

import {plantData} from '../backend/service';

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
        style={{height:30,width:30,borderRadius:15}}/>
    <Text style={styles.title}>{title}</Text>
    </View>
);

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );

    const [val1,setVal1] = useState(plantData.soilList);
    const [val2,setVal2] = useState(plantData.airList);
    const [per1,setPercent1] = useState(plantData.soilHumid);
    const [per2,setPercent2] = useState(plantData.airHumid);
    const exp = async () => {}
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
        <ScrollView>
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
        <Text style={{color:'lightgrey',marginBottom:10,fontWeight:'bold',alignSelf:'center'}}>
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
        <TouchableOpacity style={styles.exportBtn} onPress={() => exp()}>
            <Text style={{fontWeight: 'bold'}}>Export</Text>
        </TouchableOpacity>
        <Text style={{fontSize:20,color:'cyan',alignSelf:'center'}}>Devices</Text>
        <Text style={{color:'lightgrey',marginTop:-10,fontWeight:'bold',alignSelf:'center'}}>
            ____________________________________________________
        </Text>
        <View style={styles.devices}>
        <FlatList
           data={data}
           renderItem={renderItem}
           keyExtractor={(item) => item.id}
           style = {{height:270}}
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
  exportBtn: {
    height: 40,
    backgroundColor: `rgba(0,200,170,255)`,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 1.1,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
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
        width:screenWidth/1.1,
        alignSelf:'center'
    },
    item:{
        backgroundColor:'#353c57',
        padding: 20,
        //alignSelf:'center',
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row',
        borderRadius:10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 14,
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
        //backgroundColor:'#fff',
        borderRadius:25,
        marginLeft:30,
        marginRight:25,
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 14,
    },
    lineBackGround2:{
        //backgroundColor:'#fff',
        borderRadius:25,
        marginLeft:10,
        marginRight:30,
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 14,
    }
})
