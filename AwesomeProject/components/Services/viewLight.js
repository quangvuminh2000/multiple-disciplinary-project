import React, { useState } from 'react';
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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
}
const chartConfig = {
    backgroundGradientFrom: `rgba(33,35,39,255)`,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: `rgba(33,35,39,255)`,
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
var SQLite = require('react-native-sqlite-storage');
//var db = SQLite.openDatabase({name:'test2.db',createFromLocation:'~test2.db'})
var db1 = SQLite.openDatabase({name:'test2.db',createFromLocation:'~test2.db'})


export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const[val,setVal] = useState([1,2,3]);
    const[per,setPercent] = useState(1);
    db1.transaction((tx) => {
        tx.executeSql(
            'SELECT value FROM light ORDER BY time DESC LIMIT 5', [], (_tx, results) => {
                var len = results.rows.length;
                if(len > 0){
                    let lightList = [];
                    for(let i = 0; i < len; i++){
                        lightList.push(results.rows.item(i).value);
                        //console.log(results.rows.item(i).value);
                    }
                setVal(lightList.reverse());
                setPercent(val[4]);
               }
            });
        });
        console.log(val)
        console.log(per)    
    const data2 = {
        //labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [
            {
                data: val
            }
        ],
        legend:["Light level"]
    };
    return(
        <SafeAreaView style = {styles.container}>
        <ScrollView>
            <View style={styles.progress}>
            <ProgressCircle
                percent={per}
                radius={50}
                borderWidth={8}
                color={'yellow'}
                shadowColor="#999"
                bgColor={'black'}
            >
            <Text style={{color:'yellow'}}>{per + '%'}</Text>  
            </ProgressCircle>
            <Text style={{color:'yellow',marginTop:10}}>Light level</Text>
            </View>        
            <Separator/>
            <LineChart
                data = {data2}
                width = {screenWidth}
                height = {screenHeight/4}
                strokeWidth = {5}
                chartConfig = {chartConfig}
                yAxisLabel="%"
            />
           
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
        borderBottomColor: 'azure',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop:11,
        marginBottom: 15
    }
})