import React, {useState} from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

import {database, plantData} from '../../backend/service';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [maxTemp, setmaxTemp] = useState(plantData.maxTemp);
  const [minTemp, setminTemp] = useState(plantData.minTemp);

  const intSetter = setter => text => {
    setter(parseInt(text));
  };

  const reset = () => {
    setminTemp(32);
    setmaxTemp(37);
  };
  const set = () => {
    plantData.minTemp = minTemp;
    plantData.maxTemp = maxTemp;
    database.db
      .executeSql(
        'UPDATE plant SET (max_temperature, min_temperature) = (?, ?) WHERE user_id = ?;',
        [maxTemp, minTemp, database.userId],
      )
      .then(results => console.log('update plant', results[0]));
  };
  return (
    <View style={styles.container}>
      <View style={styles.minContainer}>
        <Text
          style={{
            color: '#5634ec',
            marginRight: 20,
            marginTop: 3,
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          Min
        </Text>
        <Text style={{color: 'grey', fontSize: 18}}> | </Text>
        <TextInput
          placeholder="Enter"
          placeholderTextColor="#5634ec"
          onChangeText={intSetter(setminTemp)}
          value={minTemp.toString()}
          style={styles.textInput2}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.maxContainer}>
        <Text
          style={{
            color: `rgba(255,49,49,255)`,
            marginRight: 20,
            marginTop: 3,
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          Max
        </Text>
        <Text style={{color: 'grey', fontSize: 18}}> | </Text>
        <TextInput
          placeholder="Enter"
          placeholderTextColor="red"
          onChangeText={intSetter(setmaxTemp)}
          value={maxTemp.toString()}
          style={styles.textInput1}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.setBtn} onPress={set}>
          <Text style={{color: 'azure', fontSize: 18}}>Set</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={{color: 'azure', fontSize: 18}}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#20222f',
  },
  btnContainer: {
    flexDirection: 'row',
  },
  textInput1: {
    backgroundColor: '#353c57',
    //margin:8,
    borderRadius: 10,
    width: 70,
    height: 70,
    color: `rgba(255,49,49,255)`,
    //borderWidth:1,
    //borderColor:'azure',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 4,
  },
  textInput2: {
    backgroundColor: '#353c57',
    //margin:8,
    //marginBottom:20,
    borderRadius: 10,
    height: 70,
    width: 70,
    color: '#5634ec',
    //marginTop:40,
    //borderWidth:1,
    //borderColor:'azure',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 4,
  },
  setBtn: {
    backgroundColor: '#353c57',
    marginRight: 50,
    width: 80,
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 2.5,
    height: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 14,
  },
  resetBtn: {
    backgroundColor: '#353c57',
    width: 80,
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 2.5,
    height: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 14,
  },
  minContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#353c57',
    marginTop: 20,
    height: 82,
    width: screenWidth / 2.3,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 14,
  },
  maxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#353c57',
    marginTop: 20,
    height: 82,
    width: screenWidth / 2.3,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 14,
  },
});
