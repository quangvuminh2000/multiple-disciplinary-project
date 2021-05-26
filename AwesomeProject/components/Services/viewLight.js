import React, { useContext, useEffect, useState } from 'react';
import {View,Text,Dimensions,StyleSheet,TouchableOpacity, SafeAreaView,FlatList,Image} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressCircle from 'react-native-progress-circle';
import { AppStateContext } from '../../App';
import { LightMonitor } from '../mqtt';

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
    color: (opacity = 1) => `rgba(255,255,0,${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
}
const chartConfig2 = {
    color: (opacity = 1) => `rgba(255,255,0,${opacity})`,
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
        title: "RC Servo",
        source: require('./servo.jpg')
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


export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const[light,setLight] = useState([0,0,0]);
    const[per4,setPercent4] = useState(0);

    const MqttObj = useContext(AppStateContext);
    const client = MqttObj.client;
    const soilmonitor = MqttObj.soilmonitor;
    const airmonitor = MqttObj.airmonitor;
    const lightmonitor = MqttObj.lightmonitor;
	const database = MqttObj.database;

    useEffect(() => {

        setInterval(() => {
            if (client.connected) { lightmonitor.checkCondition(); }
        }, 1000);

        client.messageCallbacks.push(data => {
            if (data.id === 13) {
                const light = parseInt(data.data);
                setPercent4(light);
                console.log('Light', light);
            }
        });

    }, []);


    // useEffect(() => {
    //     // const fetchLightData = async db => {
    //     //     let [result] = await db.executeSql('SELECT * FROM light ORDER BY time DESC LIMIT 5');
    //     //     var rows = result.rows;
    //     //     if (rows.length > 0) {
    //     //         let lightList = [...Array(rows.length).keys()].map(i => rows.item(i).value);
    //     //         setLight(lightList.reverse());
    //     //     }
    //     // };
    //     // MqttObj.db.then(fetchLightData);
		// database.fetchData('light', setLight);
    // }, []);



    const data2 = {
        labels: ["20'","15'","10'","5'","Now"],
        datasets: [
            {
                data: light
            }
        ],
        legend:["Light level"]
    };

    return(
        <SafeAreaView style = {styles.container}>
            <View style={styles.progress}>
            <ProgressCircle
                percent={per4}
                radius={50}
                borderWidth={8}
                color={'yellow'}
                shadowColor="#999"
                bgColor={'#20222f'}
            >
            <Text style={{color:'yellow'}}>{per4 + '%'}</Text>
            </ProgressCircle>
            <Text style={{color:'yellow',marginTop:10}}>Light level</Text>
            </View>
            <Text style={{color:'lightgrey',marginBottom:10,fontWeight:'bold'}}>
            ____________________________________________________
            </Text>
            <LineChart
                data = {data2}
                width = {screenWidth/1.2}
                height = {screenHeight/3.8}
                strokeWidth = {5}
                chartConfig = {chartConfig}
                yAxisLabel="%"
                style = {styles.lineBackGround}
            />
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#20222f'
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
        color:'cyan'
    },
    progress:{
        alignItems:'center',
        justifyContent:'center',
        marginTop: 50,
        marginBottom: 20
    },
    devices:{
        flex: 1,
        width: screenWidth/1.1
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
