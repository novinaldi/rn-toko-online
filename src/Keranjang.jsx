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
  Image,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import API_URL from './config';

let jumlahkeranjang = 0;
export default function Keranjang({navigation}) {
  const [loading, setLoading] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [dataCart, setDataCart] = useState([]);

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
      const json = await response.json();
      if (json.error) {
        setErrorToken(true);
      } else {
        setDataCart(json.data);
        jumlahkeranjang = json.data.length;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getDataCart();
    }, []),
  );

  // Menghitung total price
  let totalPrice = 0;
  dataCart.forEach((item) => {
    totalPrice += item.product.price * item.qty;
  });

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
    <View style={{flex: 1, backgroundColor: '#FDFDFD'}}>
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
        <View
          style={{
            flex: 3,
            backgroundColor: 'white',
          }}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                  getDataCart();
                  setRefresh(false);
                }}
              />
            }
            style={{flex: 1, marginVertical: 10}}
            data={dataCart}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  flex: 1,
                  marginHorizontal: 10,
                  elevation: 5,
                  marginTop: 10,
                  backgroundColor: 'white',
                  marginVertical: 10,
                }}>
                <Image
                  source={{
                    uri: `${item.product.image}`,
                    headers: {
                      Pragma: 'no-cache',
                    },
                  }}
                  style={styles.produkImage}
                />
                <View
                  style={{flex: 1, marginHorizontal: 10, marginVertical: 3}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: 'black',
                    }}>{`${item.product.name.substring(0, 35)} ...`}</Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'red',
                    }}>
                    {`Rp ${
                      item.product.price?.toLocaleString('id-ID') || '-'
                    } x ${item.qty}`}
                  </Text>
                </View>
              </View>
            )}
          />
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginHorizontal: 10,
              marginBottom: 5,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 20, color: 'black'}}>
              Total : Rp {totalPrice?.toLocaleString('id-ID') || '-'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  produkImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    alignItems: 'center',
  },
});
