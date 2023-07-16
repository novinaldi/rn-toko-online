import {
  Alert,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {
  PaperProvider,
  TextInput,
  Button,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const tokenKey = async value => {
    try {
      return await AsyncStorage.setItem('@token_login', value);
    } catch (error) {
      console.log(error);
    }
  };

  const doLoginUser = async () => {
    try {
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
        <Button
          style={{
            backgroundColor: '#164B60',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
          }}
          icon="login"
          mode="contained"
          onPress={() => doLoginUser()}>
          Login
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
