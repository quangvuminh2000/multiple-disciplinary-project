import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {TextInput} from 'react-native';
import {Divider} from 'react-native-elements';

import {database, plantData} from '../../backend/service';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [maxSoil, setMaxSoil] = useState(plantData.maxSoilHumid);
  const [minSoil, setMinSoil] = useState(plantData.minSoilHumid);
  const [maxAtmosphere, setMaxAtmosphere] = useState(plantData.maxAirHumid);
  const [minAtmosphere, setMinAtmosphere] = useState(plantData.minAirHumid);

  const intSetter = setter => text => {
    setter(parseInt(text));
  };

  const reset = () => {
    setMinSoil(65);
    setMaxSoil(70);
    setMinAtmosphere(65);
    setMaxAtmosphere(70);
  };
  const set = () => {
    plantData.minSoilHumid = minSoil;
    plantData.maxSoilHumid = maxSoil;
    plantData.minAirHumid = minAtmosphere;
    plantData.maxAirHumid = maxAtmosphere;
    database.db
      .executeSql(
        'UPDATE plant SET (max_air_humidity, max_soil_humidity, min_soil_humidity, min_air_humidity) = (?, ?, ?, ?) WHERE user_id = ?;',
        [maxAtmosphere, maxSoil, minSoil, minAtmosphere, database.userId],
      )
      .then(results => console.log('update plant', results[0]));
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.soilContainer}>
          <Text style={{color: 'azure', fontSize: 18}}>Soil Humidity</Text>
          <Text style={{color: 'azure', marginBottom: 15}}>
            ________________________
          </Text>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#353c57',
              borderRadius: 10,
              width: screenWidth / 2.2,
              height: 82,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 14,
            }}>
            <Text
              style={{
                color: `rgba(255,49,49,255)`,
                padding: 31,
                marginBottom: 2,
                marginRight: -5,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Min
            </Text>
            <Text
              style={{
                color: 'grey',
                marginRight: 17,
                marginTop: 29,
                fontSize: 18,
              }}>
              {' '}
              |{' '}
            </Text>
            <TextInput
              //label = 'Min Humidity'
              placeholder="Enter"
              placeholderTextColor={`rgba(255,49,49,255)`}
              onChangeText={intSetter(setMinSoil)}
              value={minSoil.toString()}
              style={styles.textInput2}
              keyboardType="numeric"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#353c57',
              borderRadius: 10,
              marginTop: 15,
              width: screenWidth / 2.2,
              //alignItems:'center',
              height: 82,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 14,
            }}>
            <Text
              style={{
                color: '#5634ec',
                padding: 30,
                marginRight: -7,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Max
            </Text>
            <Text
              style={{
                color: 'grey',
                marginRight: 17,
                marginTop: 28,
                fontSize: 18,
              }}>
              {' '}
              |{' '}
            </Text>
            <TextInput
              placeholder="Enter"
              placeholderTextColor="#5634ec"
              onChangeText={intSetter(setMaxSoil)}
              value={maxSoil.toString()}
              style={styles.textInput1}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.airContainer}>
          <Text style={{color: 'azure', fontSize: 18}}>Air Humidity</Text>
          <Text style={{color: 'azure'}}>________________________</Text>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#353c57',
              borderRadius: 10,
              marginTop: 15,
              marginLeft: 10,
              width: screenWidth / 2.3,
              height: 82,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 14,
            }}>
            <Text
              style={{
                color: `rgba(255,49,49,255)`,
                padding: 30,
                marginLeft: -6,
                marginRight: -8,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {' '}
              Min{' '}
            </Text>
            <Text
              style={{
                color: 'grey',
                marginRight: 15,
                marginTop: 29,
                fontSize: 18,
              }}>
              {' '}
              |{' '}
            </Text>
            <TextInput
              placeholder="Enter"
              placeholderTextColor={`rgba(255,49,49,255)`}
              onChangeText={intSetter(setMinAtmosphere)}
              value={minAtmosphere.toString()}
              style={styles.textInput2}
              keyboardType="numeric"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#353c57',
              borderRadius: 10,
              marginTop: 15,
              marginLeft: 10,
              width: screenWidth / 2.3,
              //alignItems:'center',
              height: 82,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 14,
            }}>
            <Text
              style={{
                color: '#5634ec',
                padding: 29,
                marginLeft: -5,
                marginRight: -12,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {' '}
              Max{' '}
            </Text>
            <Text
              style={{
                color: 'grey',
                marginRight: 15,
                marginTop: 28,
                fontSize: 18,
              }}>
              {' '}
              |{' '}
            </Text>
            <TextInput
              placeholder="Enter"
              placeholderTextColor="#5634ec"
              onChangeText={intSetter(setMaxAtmosphere)}
              value={maxAtmosphere.toString()}
              style={styles.textInput1}
              keyboardType="numeric"
            />
          </View>
        </View>
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
    margin: 8,
    borderRadius: 10,
    width: 70,
    height: 70,
    color: '#5634ec',
    marginLeft: -11,
    //borderWidth:1,
    //borderColor:'azure',
    textAlign: 'center',
    fontSize: 18,
  },
  textInput2: {
    backgroundColor: '#353c57',
    margin: 8,
    borderRadius: 10,
    width: 70,
    height: 70,
    color: 'red',
    marginLeft: -10,
    //borderWidth:1,
    //borderColor:'azure',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
  },
  setBtn: {
    backgroundColor: '#353c57',
    marginRight: 50,
    width: screenWidth / 2.5,
    height: 45,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: screenWidth / 2.5,
    height: 45,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 14,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  soilContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  airContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  verticleLine: {
    height: 18,
    width: 1.3,
    backgroundColor: 'azure',
  },
});
