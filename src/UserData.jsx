import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import API_URL from './config';

export default function UserData({navigation}) {
  const [loading, setLoading] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [iduser, setiduser] = useState();
  const [nameuser, setnameuser] = useState();
  const [emailuser, setemailuser] = useState();
  const [roleuser, setroleuser] = useState();

  const getUserDataLogin = async () => {
    let token_login = await AsyncStorage.getItem('@token_login');
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token_login,
        },
      });
      const json = await response.json();
      if (json.error) {
        setErrorToken(true);
      } else {
        setiduser(json.data.id);
        setnameuser(json.data.name);
        setemailuser(json.data.email);
        setroleuser(json.data.role);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const doKeluarAkun = async () => {
    let token_login = await AsyncStorage.getItem('@token_login');
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token_login,
        },
      });
      const json = await response.json();
      if (json) {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = () => {
    Alert.alert('LogOut', 'Anda yakin untuk log-out ?', [
      {
        text: 'Ok',
        onPress: () => doKeluarAkun(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getUserDataLogin();
    }, []),
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  ) : errorToken ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{marginBottom: 20}}>
        Anda belum login, silahkan login terlebih dahulu
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('LoginPage')}
        style={{
          backgroundColor: '#071952',
          marginVertical: 10,
          width: 100,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          elevation: 5,
        }}>
        <Text style={{color: 'white'}}>Masuk</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#1D5B79',
          marginVertical: 10,
          width: 100,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          elevation: 5,
        }}>
        <Text style={{color: 'white'}}>Daftar</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.contentData}>
        <Text style={{color: '#ADA2FF'}}>User</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <Icon5 name="user" color="#460C68" size={20} />
          <Text style={{paddingLeft: 10, fontWeight: 'bold', marginBottom: 10}}>
            {nameuser}
          </Text>
        </View>
      </View>
      <View style={styles.contentData}>
        <Text style={{color: '#ADA2FF'}}>Email</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <Icon5 name="envelope" color="#460C68" size={20} />
          <Text style={{paddingLeft: 10, fontWeight: 'bold', marginBottom: 10}}>
            {emailuser}
          </Text>
        </View>
      </View>
      <View style={styles.contentData}>
        <Text style={{color: '#ADA2FF'}}>Role</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <Icon5 name="user-cog" color="#460C68" size={20} />
          <Text style={{paddingLeft: 10, fontWeight: 'bold', marginBottom: 10}}>
            {roleuser}
          </Text>
        </View>
      </View>
      <View
        style={{marginTop: 25, marginHorizontal: 25, alignItems: 'flex-end'}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#4A55A2',
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            elevation: 5,
            borderRadius: 10,
          }}
          onPress={() => logOut()}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
            Keluar
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'space-between',
        }}>
        <Text>sdfadf</Text>
        <Text>sdfadf</Text>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentData: {
    marginTop: 25,
    marginHorizontal: 25,
    borderBottomWidth: 1,
    borderColor: '#7F167F',
  },
});
