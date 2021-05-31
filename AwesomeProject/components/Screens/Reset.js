import React, {useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

export default function Reset({navigation}) {
  const [email, setEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const reset = async () => {
    setShowLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      setShowLoading(false);
    } catch (e) {
      setShowLoading(false);
      Alert.alert(e.message);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 28,
              height: 50,
              fontWeight: 'bold',
              color: 'lightgrey',
            }}>
            Reset Password
          </Text>
        </View>

        <View style={styles.subContainer}>
          <Icon
            name="mail"
            type="feather"
            color="black"
            style={styles.loginIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Your Email"
            placeholderTextColor="black"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={() => reset()}>
          <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={{fontWeight: 'bold'}}>Back to login</Text>
        </TouchableOpacity>

        {showLoading && (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,200,170,255)',
    height: 50,
    borderRadius: 5,
    width: screenWidth / 1.2,
    margin: 10,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: screenWidth / 1.5,
    backgroundColor: 'rgba(0,200,170,255)',
    borderRadius: 25,
  },
  resetBtn: {
    height: 40,
    backgroundColor: 'indigo',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 2.5,
    margin: 20,
  },
  backBtn: {
    height: 40,
    backgroundColor: 'orange',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 2.5,
  },
  loginIcon: {
    padding: 11,
    height: 47,
    width: 46,
    resizeMode: 'stretch',
  },
});
