import React, {useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Alert,
  Dimensions,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import emitter from 'tiny-emitter/instance';

const screenWidth = Dimensions.get('window').width;
export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const login = async () => {
    if (!email) {
      Alert.alert('Please enter email !');
    }
    if (!password) {
      Alert.alert('Please enter password !');
    }
    else {
      try {
        const doLogin = await auth().signInWithEmailAndPassword(email, password);
        if (doLogin.user) {
          navigation.navigate('My App');
          emitter.emit('userLogin', doLogin.user.email);
        }
      } catch (e) {
        Alert.alert(e.message);
      }
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Image
          source={require('./pap-logo.png')}
          style={{width: 100, height: 100}}
        />
        <Text style={styles.title}>
          {' '}
          Automated Care-Taking Gardening System{' '}
        </Text>
        <View style={styles.subContainer}>
          <Icon
            name="email"
            type="zocial"
            color="black"
            style={styles.loginIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="black"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.subContainer}>
          <Icon
            name="lock"
            type="font-awesome-5"
            color="black"
            style={styles.loginIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="black"
            secureTextEntry={true}
            value={password}
            autoCapitalize="none"
            onChangeText={setPassword}
          />
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => login()}>
            <Text style={{fontWeight: 'bold'}}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              navigation.navigate('Reset');
            }}>
            <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
              Forgot password ?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text style={{fontWeight: 'bold'}}>Register</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#20222f',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: `rgba(0,200,170,255)`,
  },
  loginIcon: {
    padding: 11,
    height: 47,
    width: 46,
    resizeMode: 'stretch',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(0,200,170,255)`,
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
    backgroundColor: `rgba(0,200,170,255)`,
    borderRadius: 25,
  },
  loginBtn: {
    height: 40,
    backgroundColor: 'orange',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 2.5,
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
  registerBtn: {
    height: 40,
    backgroundColor: 'azure',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 2.5,
  },
});
