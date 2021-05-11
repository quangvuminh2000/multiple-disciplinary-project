import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import Login from './Login';

function Authen(){
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Login/>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
export default function App({navigation}) {
  const createUser = () => {
    auth()
    .signInWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
    console.error(error);
  });
  }

  const logOut = () => {
    auth()
    .signOut()
    .then(() => console.log('User signed out!'));
  }
  
  return(
    <View style={{flex:1,backgroundColor:'azure'}}>
      <Authen/>
      <Button
        title = "Login as Jane"
        onPress = {createUser}
      />
      <Button
        title = "Log out"
        onPress = {logOut}
      />
    </View>
  )
}