import React, { useState } from 'react';
import {View, Text, TouchableOpacity,Image, StyleSheet,TouchableHighlight} from 'react-native';
export default function App ({navigation}){
  const [text1,setText1] = useState('Off');
  const [text2,setText2] = useState('Off');
  const [text3,setText3] = useState('Off');
  const [borderColor1,setColor1] = useState('#999');
  const [borderColor2,setColor2] = useState('#999');
  const [borderColor3,setColor3] = useState('#999');
  function change1(){
    if(text1 === 'Off'){
      setText1('On');
      setColor1(`rgba(0,200,170,255)`);
    }
    else if(text1 === 'On'){
      setText1('Off');
      setColor1('#999')
    } 
  }
  function change2(){
    if(text2 === 'Off'){
      setText2('On');
      setColor2('blue');
    }
    else if(text2 === 'On'){
      setText2('Off');
      setColor2('#999')
    } 
  }
  function change3(){
    if(text3 === 'Off'){
      setText3('On');
      setColor3('yellow');
    }
    else if(text3 === 'On'){
      setText3('Off');
      setColor3('#999')
    } 
  }
  const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
  }

  return(
    <View style={styles.container}>
    <Image source = {require('./pap-logo.png')} 
           style = {{width:100,height:100}}
    />
    <Text style={styles.welcomeText}>Welcome to AGCS!</Text>
    <Text style={styles.welcomeText}>Your Garden's personal Caretaker</Text>
    <Separator/>
    <View style={styles.btnContainer}>
      <View style={{justifyContent:'center',textAlign:'center'}}>
      <Text style={{color:`rgba(0,200,170,255)`,fontWeight:'bold',marginBottom: 10}}>Soil Irrigation</Text>
      <TouchableOpacity style={[styles.soilBtn,{borderColor:borderColor1}]} onPress = {change1}>
        <Text style={styles.text1}>{text1}</Text>
      </TouchableOpacity>
      </View>
      <View style={{justifyContent:'center',textAlign:'center'}}>
      <Text style={{color:'blue',alignSelf:'center',fontWeight:'bold',marginBottom:10}}>Mist spray</Text>
      <TouchableOpacity style={[styles.mistBtn,{borderColor:borderColor2}]} onPress = {change2}>
        <Text style={styles.text2}>{text2}</Text>
      </TouchableOpacity>
      </View>
    </View>
    <Text style={{color:'yellow',fontWeight:'bold',marginTop:10}}>Shading Net</Text>
    <TouchableOpacity style={[styles.netBtn,{borderColor:borderColor3}]} onPress = {change3}>
      <Text style={styles.text3}>{text3}</Text>
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
    //borderColor:`rgba(0,200,170,255)`,
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
    //borderColor:'blue',
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
  },
  separator:{
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15
  }
})