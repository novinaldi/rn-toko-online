import {
  Text,
  Alert,
  StyleSheet,
  ToastAndroid,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  PaperProvider,
  TextInput,
  MD3LightTheme as DefaultTheme,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import API_URL from './config';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    secondary: 'yellow',
  },
};

export default function LoginPage({navigation}) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setLoading] = useState(false);

  const tokenKey = async value => {
    try {
      return await AsyncStorage.setItem('@token_login', value);
    } catch (error) {
      console.log(error);
    }
  };

  const doLoginUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const json = await response.json();
      if (json.error) {
        Alert.alert(
          'Warning',
          'Silahkan Periksan Inputan email dan password anda !',
        );
      } else {
        tokenKey(json.access_token);
        ToastAndroid.show('Login Anda Berhasil', ToastAndroid.LONG);
        navigation.push('HomeScreen');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={{flex: 1, marginVertical: 10}}>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
          }}
          label="Email"
          value={email}
          onChangeText={value => setemail(value)}
          left={<TextInput.Icon icon="email" color="black" />}
        />
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
          }}
          value={password}
          onChangeText={value => setpassword(value)}
          left={<TextInput.Icon icon="lock" color="black" />}
          label="Password"
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
                return false;
              }}
            />
          }
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#164B60',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}
          disabled={loading ? true : false}
          onPress={() => doLoginUser()}>
          {loading ? (
            <ActivityIndicator size={30} color="white" />
          ) : (
            <View style={{flexDirection: 'row'}}>
              <IconMaterial name="login" color="white" size={26} />
              <Text style={{color: '#ffffff', fontWeight: 'bold',fontSize: 20,paddingLeft:10}}>
                Login
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Divider />
        <TouchableOpacity
          style={{
            backgroundColor: '#164B60',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}
          onPress={() => navigation.push('RegisterPage')}>
          <View style={{flexDirection: 'row'}}>
            <IconMaterial name="account-plus" color="white" size={26} />
            <Text style={{color: '#ffffff', fontWeight: 'bold',fontSize: 20,paddingLeft:10}}>
              Register
            </Text>
            </View>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
