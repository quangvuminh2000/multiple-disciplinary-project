
import React,{useState} from 'react';
import { Component } from 'react';
import {View, Text, TouchableOpacity,Image, StyleSheet} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '../app/src/main/assets/test.db'})


export default function App(){

    const [val,setVal] = useState();
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soil WHERE time=?', ['2021-05-22'], (_tx, results) => {
          var len = results.rows.length;
          if(len > 0) {
            // exists owner name John
            var row = results.rows.item(0);
            setVal(row.value);
          }
        });
    });
  
    return (
      <View style={styles.container}>
        <Text>SQLite Example</Text>
        <Text>{'At 2021-05-22, soil humidity value is' + ' ' + val}</Text>
      </View>
    );
  
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})