import { Text, Alert, StyleSheet, ToastAndroid, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PaperProvider, TextInput, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import React, {useState} from 'react';
import API_URL from './config';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    secondary: 'yellow',
  },
};

export default function RegisterPage({navigation}) {
  const [inputname, setInputname] = useState();
  const [inputemail, setInputemail] = useState();
  const [inputpassword, setInputpassword] = useState();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const kosongkanInputan = () => {
    setInputname('');
    setInputemail('');
    setInputpassword('');
  };
  const doRegister = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: inputname,
          email: inputemail,
          password: inputpassword,
        }),
      });
      const json = await response.json();
      if (json.error) {
        Alert.alert(
          'Warning',
          'Silahkan Periksa semua inputan, tidak boleh ada yang kosong',
        );
      } else {
        ToastAndroid.show(
          'Registrasi Anda Berhasil, silahkan lakukan login',
          ToastAndroid.LONG,
        );
        navigation.push('LoginPage');
      }
      kosongkanInputan();
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
          label="Name"
          value={inputname}
          onChangeText={value => setInputname(value)}
        />
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
          }}
          label="Email"
          value={inputemail}
          onChangeText={value => setInputemail(value)}
        />
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            elevation: 3,
            marginVertical: 20,
          }}
          value={inputpassword}
          onChangeText={value => setInputpassword(value)}
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
          onPress={() => doRegister()}>
          {loading ? (
            <ActivityIndicator size={30} color="white" />
          ) : (
            <Text
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              Daftar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
