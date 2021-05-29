import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import emitter from 'tiny-emitter/instance';

import {AppStateContext} from '../../App';
export default function Home({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const MqttObj = useContext(AppStateContext);
  const soilMonitor = MqttObj.soilmonitor;
  const airMonitor = MqttObj.airmonitor;
  const lightMonitor = MqttObj.lightmonitor;

  const [pumpActivated, setPumpActivated] = useState(soilMonitor.soilIrrigation);
  const [sprayActivated, setSprayActivated] = useState(airMonitor.mistSpray);
  const [netActivated, setNetActivated] = useState(lightMonitor.net);

  useEffect(() => {
    const onAuthStateChanged = user => {
      setUser(user);
      setInitializing(false);
    };
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    ///////////////////////////////////////////////////
    soilMonitor.start();
    airMonitor.start();
    lightMonitor.start();
    ////////////////////////
    return subscriber; // unsubscribe on unmount
  }, []);
  useEffect(() => {
    emitter.on('pumpActivated', setPumpActivated);
    return () => emitter.off('pumpActivated', setPumpActivated);
  }, []);
  useEffect(() => {
    emitter.on('sprayActivated', setSprayActivated);
    return () => emitter.off('sprayActivated', setSprayActivated);
  }, []);
  useEffect(() => {
    emitter.on('netActivated', () => setNetActivated(true));
    return () => emitter.off('netActivated', setNetActivated);
  }, []);

  const text1 = pumpActivated ? 'On' : 'Off';
  const borderColor1 = pumpActivated ? 'rgba(0,200,170,255)' : '#999';
  const text2 = sprayActivated ? 'On' : 'Off';
  const borderColor2 = sprayActivated ? '#04d9ff' : '#999';
  const text3 = netActivated ? 'On' : 'Off';
  const borderColor3 = netActivated ? 'yellow' : '#999';

  if (initializing) return null;
  if (!user) {
    return navigation.navigate('Login');
  }

  const logoff = () => {
    auth()
    .signOut()
    .then(()=>console.log('User signed out'))
  }

  const change1 = () => {
    if (pumpActivated) {
      soilMonitor.deactivatePump();
    } else {
      soilMonitor.activatePump();
    }
  };
  const change2 = () => {
    if (sprayActivated) {
      soilMonitor.deactivateSpray();
    } else {
      soilMonitor.activateSpray();
    }
  };
  const change3 = () => {
    if (netActivated) {
      soilMonitor.deactivateNet();
    } else {
      soilMonitor.activateNet();
    }
  };
  const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
  }

  return (
    <View style={styles.container}>
      <Image source = {require('./pap-logo.png')}
          style = {{width:100,height:100}}
      />
      <Text style={styles.welcomeText}>Welcome {user.email} ! </Text>
      <Text style={styles.welcomeText}>Your Garden's personal Caretaker</Text>

      <View style={styles.btnContainer}>
      
      <View style={styles.soilBox}>
          <Text style={{color:`rgba(0,200,170,255)`,fontWeight:'bold',marginBottom: 10}}>Soil Irrigation</Text>
          <TouchableOpacity style={[styles.soilBtn,{borderColor:borderColor1}]} onPress = {change1}>
          <Text style={styles.text1}>{text1}</Text>
          </TouchableOpacity>
      </View>
      
      <View style={styles.mistBox}>
      <Text style={{color:'#04d9ff',alignSelf:'center',fontWeight:'bold',marginBottom:10}}>Mist spray</Text>
      <TouchableOpacity style={[styles.mistBtn,{borderColor:borderColor2}]} onPress = {change2}>
        <Text style={styles.text2}>{text2}</Text>
      </TouchableOpacity>
      </View>
    </View>
    <View style={styles.netBox}>
      <Text style={{color:'yellow',fontWeight:'bold',marginTop:10}}>Shading Net</Text>
      <TouchableOpacity style={[styles.netBtn,{borderColor:borderColor3}]}onPress = {change3}>
        <Text style={styles.text3}>{text3}</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

//Home.navigationOptions = ({ navigation }) => ({
  //title: 'Home',
  //headerRight: () => <Button
    //      buttonStyle={{ padding: 0, marginRight: 20, backgroundColor: 'transparent' }}
      //    icon={
        //      <Icon
          //        name="cancel"
            //      size={28}
              //    color="white"
              ///>
         // }
          //onPress={() => {auth().signOut()}} />,
//});
const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center' ,
    backgroundColor:'#20222f'
  },

  welcomeText:{
    fontSize: 20,
    textAlign: 'center',
    color:'grey'
  },

  soilBtn:{
    width:100,
    height:100,
    borderRadius:100,
    borderWidth:10,
    //borderColor:`rgba(0,200,170,255)`,
    backgroundColor:'#353c57',
    alignItems:'center',
    justifyContent:'center',
    //marginRight:90
  },

  mistBtn:{
    width:100,
    height:100,
    borderRadius:100,
    borderWidth:10,
    //borderColor:'blue',
    backgroundColor:'#353c57',
    alignItems:'center',
    justifyContent:'center',
  },

  btnContainer:{
    flexDirection:'row',
    marginTop:20,
    backgroundColor:'#20222f'
  },

  netBtn:{
    width:100,
    height:100,
    borderRadius:100,
    backgroundColor:'#353c57',
    borderColor:'yellow',
    borderWidth:10,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10
  },

  text1:{
    color:`rgba(0,200,170,255)`
  },

  text2:{
    color:'#04d9ff'
  },

  text3:{
    color:'yellow'
  },

  separator:{
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15
  },
  soilBox:{
    backgroundColor:'#353c57',
    width:150,
    height:160,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    marginRight:25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 14,
  },

  mistBox:{
    backgroundColor:'#353c57',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    width:150,
    height:160,
    borderRadius:25,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 14,
  },

  netBox:{
    backgroundColor:'#353c57',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    width:150,
    height:160,
    borderRadius:25,
    marginTop:20,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 14,
  }


})
