import React,{useState,useEffect} from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
//import { set } from 'react-native-reanimated';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'test4.db',createFromLocation:1});

export default function App({navigation}){
    const [time,setTime] = useState('');
    const [val,setVal] = useState();
    
    const insertData = () => {
 
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO soil (time, value) VALUES (?,?)',
            [time, val],
            (_tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                Alert.alert('Data Inserted Successfully....');
              } else Alert.alert('Failed....');
            }
          );
        });
     
        //viewStudent() ;
    }
    const viewSoil = () => {
 
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM soil',
            [],
            (_tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              console.log(temp);
            }
          );
        });
     
    }
    return(
        <View style={styles.container}>
            <TextInput
                placeholder = 'Enter time'
                placeholderTextColor = 'black'
                value = {time}
                onChangeText = {(text) => setTime(text)}
                style = {styles.textInput}
            />

            <TextInput
                placeholder = 'Enter value'
                placeholderTextColor = 'black'
                value = {val}
                onChangeText = {(text) => setVal(text)}
                style = {styles.textInput}
            />

            <TouchableOpacity style = {styles.btn} onPress = {insertData}>
                <Text>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.btn} onPress = {viewSoil}>
                <Text>See data</Text>
            </TouchableOpacity>

            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    btn:{
        justifyContent:'center',
        alignItems:'center'
    },
    textInput:{
        color:'black',
        backgroundColor:'orange'
    }
})