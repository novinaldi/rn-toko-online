import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import API_URL from './config';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

export default function DetailProduk({route, navigation}) {
  const [loading, setLoading] = useState(false);
  const [idProduk, setIdProduk] = useState();
  const [gambar, setGambar] = useState();
  const [namaProduk, setNamaProduk] = useState();
  const [harga, setHarga] = useState();
  const [desc, setDesc] = useState();

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
        setHarga(json.data.price);
        setDesc(json.data.description);
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

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.imgProduk}>
        <FastImage
          source={{uri: `${gambar}`}}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 10,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
      </View>
      <View
        style={{
          flex: 2,
          backgroundColor: 'white',
          marginTop: 5,
          elevation: 5,
        }}>
        <ScrollView>
          <Text
            style={{
              color: '#862B0D',
              fontWeight: 'bold',
              fontSize: 20,
              marginHorizontal: 10,
            }}>{`Rp ${harga?.toLocaleString('id-ID') ?? '0'}`}</Text>
          <Text
            style={{
              color: 'black',
              fontSize: 17,
              marginHorizontal: 10,
              fontWeight: 'bold',
            }}>
            {namaProduk}
          </Text>
          <Text
            style={{
              color: '#862B0D',
              fontSize: 18,
              marginHorizontal: 10,
              marginTop: 10,
              fontWeight: 'bold',
              borderBottomWidth: 3,
              borderBottomColor: '#862B0D',
            }}>
            Deskripsi Produk
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginHorizontal: 10,
              textAlign: 'justify',
            }}>
            {desc}
          </Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: '#0B666A',
              height: 40,
              justifyContent: 'center',
              marginHorizontal: 30,
              marginTop: 20,
              borderRadius: 15,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
              Masukkan Ke-Keranjang
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  imgProduk: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 5,
  },
});
