import React, {useEffect, useState} from 'react';
import {View,Text,Dimensions,StyleSheet,TouchableOpacity, SafeAreaView,FlatList,Image} from 'react-native';
import {LineChart,ProgressChart} from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressCircle from 'react-native-progress-circle';
import {openDatabase} from 'react-native-sqlite-storage'
import { AsyncStorage } from '@react-native-community/async-storage';
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
    color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
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
var db = SQLite.openDatabase({name:'test2.db',createFromLocation:'~test2.db',deferRender:true})
export default function App({navigation}){
    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const [val,setVal] = useState([1,2,3]);
    const [per,setPercent] = useState(1);
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT value FROM temperature ORDER BY DESC LIMIT 5', [], (_tx, results) => {
                var len = results.rows.length;
                console.log("IN BITCH");
                if(len > 0){
                    let tempList = [];
                    for(let i = 0; i < len; i++){
                        tempList.push(results.rows.item(i).value);
                        //console.log(results.rows.item(i).value);
                    }
                setVal(tempList);
                setPercent(tempList[0]);
                
               }
            });
        }); 
    console.log(val);
    const data2 = {
        labels: ["20'","15'","10'","5'","Now"],
        datasets: [
        {
            data: val,
            strokeWidth: 4.5
        }
        ],
        legend:["Temperature"]
      }  
    return(
        <SafeAreaView style = {styles.container}> 
        <ScrollView>
        <View style={styles.progress}>
            <ProgressCircle
                percent={per}
                radius={50}
                borderWidth={8}
                color={'red'}
                shadowColor="#999"
                bgColor={'black'}
                style={styles.progress}
            >
            <Text style={{color:'red'}}>{'30ºC'}</Text>  
            </ProgressCircle>
            <Text style={{color:'red',marginTop:10}}>Temperature</Text>
        </View>
        <Separator/>
        <LineChart
            data = {data2}
            width = {screenWidth}
            height = {screenHeight/4}
            chartConfig = {chartConfig}
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
        backgroundColor:'black'
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