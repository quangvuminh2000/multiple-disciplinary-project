import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import {LineChart, ProgressChart} from 'react-native-chart-kit';
import {ScrollView} from 'react-native-gesture-handler';
import ProgressCircle from 'react-native-progress-circle';
import emitter from 'tiny-emitter/instance';

import {plantData} from '../backend/service';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Separator = () => {
  return <View style={styles.separator} />;
};
const chartConfig = {
  backgroundGradientFrom: '#353c57',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#353c57',
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(255,49,49,${opacity})`,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const data = [
  {
    id: '1',
    title: 'DHT11',
    source: require('./DHT11.jpg'),
  },

  {
    id: '2',
    title: 'Water Pumper',
    source: require('./pump.jpg'),
  },
];

const Item = ({source, title}) => (
  <View style={styles.item}>
    <Image source={source} style={{height: 30, width: 30, borderRadius:15}} />
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function App({navigation}) {
  const [temp, setTemp] = useState(plantData.tempList);
  const [per3, setPercent3] = useState(plantData.temp);
const exp = async () => {}
  useEffect(() => {
    const callback = (dataType, data) => {
      if (dataType === 'temperature') {
        setPercent3(data);
      }
    };
    emitter.on('sensorDataReceived', callback);
    return () => emitter.off('sensorDataReceived', callback);
  }, []);
  useEffect(() => {
    const callback = (table, data) => {
      if (table === 'temperature') {
        setTemp(data);
      }
    };
    emitter.on('databaseFetched', callback);
    return () => emitter.off('databaseFetched', callback);
  }, []);

  const renderItem = ({item}) => (
    <Item title={item.title} source={item.source} />
  );
  const data2 = {
    labels: ["20'", "15'", "10'", "5'", 'Now'],
    datasets: [
      {
        data: temp,
        strokeWidth: 4.5,
      },
    ],
    legend: ['Temperature'],
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.progress}>
        <ProgressCircle
          percent={per3}
          radius={50}
          borderWidth={8}
          color={`rgba(255,49,49,255)`}
          shadowColor="#999"
          bgColor={'#20222f'}
          style={styles.progress}
          //rgba(255,49,49,255)
        >
          <Text style={{color: `rgba(255,49,49,255)`}}>{per3 + 'ºC'}</Text>
        </ProgressCircle>
        <Text style={{color: `rgba(255,49,49,255)`, marginTop: 10}}>
          Temperature
        </Text>
      </View>
      <Text style={{color: 'lightgrey', marginBottom: 10, fontWeight: 'bold', alignSelf:'center'}}>
        ____________________________________________________
      </Text>
      <LineChart
        data={data2}
        width={screenWidth / 1.2}
        height={screenHeight / 3.8}
        chartConfig={chartConfig}
        style={styles.lineBackGround}
      />
      <TouchableOpacity style={styles.exportBtn} onPress={() => exp()}>
        <Text style={{fontWeight: 'bold'}}>Export</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Devices</Text>
      <Text style={{color: 'lightgrey', marginTop: -10, fontWeight: 'bold',alignSelf:'center'}}>
        ____________________________________________________
      </Text>
      <View style={styles.devices}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style = {{height:200}}
        />
      </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20222f',
  },
  button: {
    backgroundColor: 'green',
    height: 40,
    width: 110,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  exportBtn: {
    height: 40,
    backgroundColor: `rgba(0,200,170,255)`,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 1.1,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    marginTop: 10,
    color: 'cyan',
    alignSelf:'center'
  },
  progress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  devices: {
    flex: 1,
    width: screenWidth / 1.1,
  },
  item: {
    backgroundColor: '#353c57',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 14,
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
    color: 'cyan',
  },
  separator: {
    borderBottomColor: 'azure',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 11,
    marginBottom: 15,
  },
  lineBackGround: {
    //backgroundColor:'#fff',
    borderRadius: 25,
    alignSelf:'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 14,
  },
});
