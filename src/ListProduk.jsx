import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import API_URL from './config';

export default function ListProduk({navigation}) {
  const [ListProduk, setListProduk] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getListProduk = async () => {
    await fetch(`${API_URL}/product/list`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        // console.log(json.data);
        setListProduk(json.data);
        setLoading(false);
      })
      .catch(e => console.log(e.response));
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getListProduk();
    }, []),
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  ) : (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              getListProduk();
              setRefresh(false);
            }}
          />
        }
        data={ListProduk}
        numColumns={2}
        contentContainerStyle={{paddingVertical: 10}}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailProduk', {
                id: item.id,
                idProduk: item.id,
              })
            }
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
              marginHorizontal: 10,
              borderWidth: 0,
              borderColor: '#98EECC',
              elevation: 1,
            }}>
            <Image
              source={{
                uri: `${item.image}`,
                headers: {
                  Pragma: 'no-cache',
                },
              }}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'stretch',
                marginTop: 3,
              }}
            />
            <Text
              style={{
                color: '#071952',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              {item.name.length > 20
                ? `${item.name.substring(0, 20)} ...`
                : item.name}
            </Text>
            <Text
              style={{
                paddingBottom: 5,
                fontWeight: 'bold',
                color: '#862B0D',
              }}>
              {`Rp ${item.price.toLocaleString('id-ID')}`}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
