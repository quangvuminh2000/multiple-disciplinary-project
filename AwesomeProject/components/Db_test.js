
import React from 'react';
import {View, Text, TouchableOpacity,Image, StyleSheet} from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~test.db'})


export default function App({navigation}) {
  constructor(props) {
    super(props)

    this.state = {
      val: "",
    };

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soil WHERE time=?', ['2021-05-22'], (tx, results) => {
          var len = results.rows.length;
          if(len > 0) {
            // exists owner name John
            var row = results.rows.item(0);
            this.setState({val: row.value});
          }
        });
    });

    ToastAndroid.show('Hello!!', ToastAndroid.SHORT);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>SQLite Example</Text>
        <Text>{'At 2021-05-22, soil humidity value is' + this.state.val}</Text>
      </View>
    );
  }
}