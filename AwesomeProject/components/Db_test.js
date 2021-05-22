
import React,{useState} from 'react';
import { Component } from 'react';
import {View, Text, TouchableOpacity,Image, StyleSheet} from 'react-native';

var SQLite = require('react-native-sqlite-storage')
//var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~test.db'})
var db = SQLite.openDatabase({name: 'test1.db', createFromLocation:'~test1.db'})

export default function App(){

    const [val,setVal] = useState();
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soil WHERE time=?', ['2021-05-22 10:00:00'], (_tx, results) => {
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
        <Text>{'User ID:' + ' ' + val}</Text>
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