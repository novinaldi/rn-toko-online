import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import API_URL from './config';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function DetailProduk({route, navigation}) {
  const [loading, setLoading] = useState(false);
  const [idProduk, setIdProduk] = useState();
  const [gambar, setGambar] = useState();
  const [namaProduk, setNamaProduk] = useState();

  const getDetailProduk = async () => {
    fetch(`${API_URL}/product/` + route.params.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        // setIdProduk(json.data.id);
        setNamaProduk(json.data.name);
        setGambar(json.data.image);
        setLoading(false);
      })
      .catch(e => console.log(e));
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getDetailProduk();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{uri: `${gambar}`}}
        style={{
          width: '100%',
          height: '100%',
          flex: 1 / 2,
          marginTop: 5,
          elevation: 5,
        }}
        resizeMode="stretch"></ImageBackground>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'blue',
        }}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
