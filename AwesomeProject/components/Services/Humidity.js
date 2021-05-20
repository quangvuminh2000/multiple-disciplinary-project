import React, {useContext, useEffect, useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,SafeAreaView,ScrollView,FlatList,Image} from 'react-native';
import {LineChart} from 'react-native-chart-kit'
import {openDatabase} from 'react-native-sqlite-storage'
import ProgressCircle from 'react-native-progress-circle';
import { AsyncStorage } from '@react-native-community/async-storage';
import { AppStateContext } from '../../App';
import { SoilMonitor } from '../mqtt';


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
    //barPercentage: 0.5,
    useShadowColorFromDataset: false
}

const chartConfig4 = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0,0,255,${opacity})`,
    strokeWidth: 2,
    //barPercentage: 0.5,
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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'test2.db',createFromLocation:'~test2.db'})


export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const [val1,setVal1] = useState([0,0,0]);
    const [val2,setVal2] = useState([0,0,0]);
    const [per1,setPercent1] = useState(0);
    const [per2,setPercent2] = useState(0);

    const client = useContext(AppStateContext);
    useEffect(() => {
        let monitor = new SoilMonitor(client);
        setInterval(() => {
            if (client.client.connected) { monitor.checkCondition(); }
        }, 1000);

        setPercent1(client.soilHumid);
        // console.log("Soil Humid", client.soilHumid)
        setPercent2(client.airHumid);
        // console.log("Air Humid", client.airHumid)

    }, [client.soilHumid, client.airHumid]);
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM soil ORDER BY time DESC LIMIT 5', [], (_tx, results) => {
                var len = results.rows.length;
                if(len > 0){
                    let soilList = [];
                    for(let i = 0; i < len; i++){
                        soilList.push(results.rows.item(i).value);
                        //console.log(results.rows.item(i).value);
                    }
                setVal1(soilList.reverse());
                }
            });
        });

    db.transaction((tx) => {
        tx.executeSql(
            'SELECT value FROM air ORDER BY time DESC LIMIT 5', [], (_tx, results) => {
                var len = results.rows.length;
                if(len > 0){
                    let airList = [];
                    for(let i = 0; i < len; i++){
                        airList.push(results.rows.item(i).value);
                        //console.log(results.rows.item(i).value);
                    }
                setVal2(airList.reverse());
                }
            });
        });

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
                color={'green'}
                shadowColor="#999"
                bgColor={'black'}
        >
        <Text style={{color:'green'}}>{ per1 + '%'}</Text>  
        </ProgressCircle>
        <Text style={{color:'green',marginTop:10}}>Soil moisture</Text>
        </View>
        <View style = {styles.airProgress}>
        <ProgressCircle
                percent={per2}
                radius={50}
                borderWidth={8}
                color={'blue'}
                shadowColor="#999"
                bgColor={'black'}
        >
        <Text style={{color:'blue'}}>{per2 + '%'}</Text>  
        </ProgressCircle>
        <Text style={{color:'blue',marginTop:10}}>Atmosphere moisture</Text>
        </View>
        </View>

        <Separator/>

        <View style = {styles.lineContainer}>
        <LineChart
            data = {data3}
            width = {screenWidth/2}
            height = {screenHeight/4}
            chartConfig = {chartConfig3}
            verticalLabelRotation = {30}
        />
        <LineChart
            data = {data4}
            width = {screenWidth/2}
            height = {screenHeight/4}
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
        alignItems:'center'
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
        justifyContent:'center',
        marginRight:40
    },
    text:{
        fontSize: 20,
        color:'grey'
    },
    devices:{
        flex: 1,
        width:screenWidth/1.1
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