import React, {useEffect, useState, useContext} from 'react';
import {View,Text,Dimensions,StyleSheet,TouchableOpacity, SafeAreaView,FlatList,Image} from 'react-native';
import {LineChart,ProgressChart} from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressCircle from 'react-native-progress-circle';
import {openDatabase} from 'react-native-sqlite-storage';
import { AsyncStorage } from '@react-native-community/async-storage';
import {AppStateContext} from '../../App';
import {AirMonitor,MqttClient} from '../mqtt';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
}
const chartConfig = {
    backgroundGradientFrom: '#353c57',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#353c57',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(255,49,49,${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
}
const chartConfig1 = {
    color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}
const data = [
    {
        id: "1",
        title: "DHT11",
        source: require('./DHT11.jpg')
    },
    
    {
        id: "2",
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

var SQLite = require('react-native-sqlite-storage');
//var db = SQLite.openDatabase({name:'test1.db',createFromLocation:'~test1.db'})
var db1 = SQLite.openDatabase({name:'test2.db',createFromLocation:'~test2.db'})

export default function App({navigation}){
    const [temp,setTemp] = useState([0,0,0]);
    const [per3,setPercent3] = useState(0);

    const MqttObj = useContext(AppStateContext);
    const client = MqttObj.client;
    const soilmonitor = MqttObj.soilmonitor;
    const airmonitor = MqttObj.airmonitor;
    const lightmonitor = MqttObj.lightmonitor;
    useEffect(() => {
        // Update the document title using the browser API
        // console.log('ok');
        //let client = new MqttClient(callback);
        //setClient(new MqttClient(callback));
        setInterval(() => {
            if (client.client.connected) { airmonitor.checkCondition(); }
        }, 1000);
        //var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // db1.transaction((tx) => {
        //     tx.executeSql(
        //         'INSERT INTO temperature(time, value) VALUE (?,?)', [date,client.temp], (tx, results) => {
        //   console.log('Results', results.rowsAffected);
        //   if (results.rowsAffected > 0) {
        //     console.log("Success");
        //   } else console.log('Registration Failed');
        //     });
        //     });
        setPercent3(client.temp);

    }, [client.temp]);

    db1.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM temperature ORDER BY time DESC LIMIT 5', [], (tx, results) => {
                var len = results.rows.length;
                //console.log("IN BITCH");
                if(len > 0){
                    let tempList = [];
                    for(let i = 0; i < len; i++){
                        tempList.push(results.rows.item(i).value);
                        //console.log(results.rows.item(i).value);
                    }
                setTemp(tempList.reverse());
                //setPercent3(tempList[0]);
                }
            });
        });

    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const data2 = {
        labels: ["20'","15'","10'","5'","Now"],
        datasets: [
        {
            data: temp,
            strokeWidth: 4.5
        }
        ],
        legend:["Temperature"]
      }
    return(
        <SafeAreaView style = {styles.container}>
        <View style={styles.progress}>
            <ProgressCircle
                percent={per3}
                radius={50}
                borderWidth={8}
                color={'red'}
                shadowColor="#999"
                bgColor={'#20222f'}
                style={styles.progress}
                //rgba(255,49,49,255)

            >
            <Text style={{color:'red'}}>{per3 + 'ºC'}</Text>
            </ProgressCircle>
            <Text style={{color:'red',marginTop:10}}>Temperature</Text>
        </View>
        <Separator/>
        <LineChart
            data = {data2}
            width = {screenWidth}
            height = {screenHeight/4}
            chartConfig = {chartConfig}
            style = {styles.lineBackGround}
        />
        <Text style={styles.text}>Devices</Text>
        <Text style={{color:'lightgrey',marginTop:-10}}>_______________________________________________</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#20222f'
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
        fontSize: 20,
        marginTop: 10,
        color:'grey'
    },
    progress:{
        alignItems:'center',
        justifyContent:'center',
        marginTop: 50,
        marginBottom: 20
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
        color:`rgba(0,200,170,255)`
    },
    separator:{
        borderBottomColor: 'azure',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop:11,
        marginBottom: 15
    },
    lineBackGround:{
        borderRadius: 25
    }
})