import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import API_URL from './config';

export let jumlahkeranjang = 0;

export default function Keranjang({navigation}) {
  const [loading, setLoading] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [dataCart, setDataCart] = useState([]);
  const [dataProduk, setdataProduk] = useState([]);
  const [idCart, setIdCart] = useState();
  const [useridCart, setUseridCart] = useState();
  const [idproductCart, setIdproductCart] = useState();
  const [qtyCart, setQtyCart] = useState();
  const [namaproduk, setNamaproduk] = useState();
  const [gambarProduk, setgambarProduk] = useState();
  const [hargaproduk, sethargaproduk] = useState();

  const getDataCart = async () => {
    let token_login = await AsyncStorage.getItem('@token_login');
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token_login,
        },
      });
      const jsonCart = await response.json();
      if (jsonCart.error) {
        setErrorToken(true);
      } else {
        setDataCart(jsonCart);
        setdataProduk(jsonCart.product);
        console.log(jsonCart);
        console.log(jsonCart.product);
      }
      jumlahkeranjang = jsonCart.data.length;
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataCart();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDataCart();
    }, []),
  );

  const renderProdukItem = ({item, index}) => {
    if (!item) {
      return null; // Tidak melakukan render jika objek item undefined
    }

    return (
      <View>
        <Text>{dataCart}</Text>
      </View>
    );
  };

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  ) : errorToken ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Silahkan Login terlebih dahulu untuk melihat keranjang anda.</Text>
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
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1 / 3,
          marginHorizontal: 10,
          elevation: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: 'black',
          }}>
          My Cart
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Keranjang')}>
          <Icon name="sync-alt" color="#071952" size={20} />
        </TouchableOpacity>
      </View>
      {jumlahkeranjang === 0 ? (
        <View
          style={{
            flex: 3,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Keranjang anda kosong
          </Text>
        </View>
      ) : (
        <SafeAreaView style={{flex: 3}}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                  setRefresh(true);
                  getDataCart();
                  setRefresh(false);
                }}
              />
            }
            data={dataCart}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            keyExtractor={item => item.id}
            renderItem={renderProdukItem}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    paddingVertical: 10,
  },
});
