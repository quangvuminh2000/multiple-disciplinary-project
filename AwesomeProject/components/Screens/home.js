import React from 'react';
import {View, Text, TouchableOpacity,Image, StyleSheet} from 'react-native';
export default function App ({navigation}){
  return(
    <View style={styles.container}>
    <Image source = {require('./pap-logo.png')} 
           style = {{width:100,height:100}}
    />
    <Text style={styles.welcomeText}>Welcome to AGCS!</Text>
    <Text style={styles.welcomeText}>Your Garden's personal Caretaker</Text>
    <View style={styles.btnContainer}>
      <TouchableOpacity style={styles.soilBtn}>
        <Text style={styles.text1}>Soil irrigation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mistBtn}>
        <Text style={styles.text2}>Mist spray</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.netBtn}>
        <Text style={styles.text3}>Shading net</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    color:'grey'
  },
  soilBtn:{
    width:100,
    height:100,
    borderRadius:100,
    borderWidth:5,
    borderColor:`rgba(0,200,170,255)`,
    backgroundColor:'black',
    alignItems:'center',
    justifyContent:'center',
    marginRight:90
  },
  mistBtn:{
    width:100,
    height:100,
    borderRadius:100,
    borderWidth:5,
    borderColor:'blue',
    backgroundColor:'black',
    alignItems:'center',
    justifyContent:'center',
    
  },
  btnContainer:{
    flexDirection:'row',
    marginTop:20
  },
  netBtn:{
    width:100,
    height:100,
    borderRadius:100,
    backgroundColor:'black',
    borderColor:'yellow',
    borderWidth:5,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10
  },
  text1:{
    color:`rgba(0,200,170,255)`
  },
  text2:{
    color:'blue'
  },
  text3:{
    color:'yellow'
  }
})