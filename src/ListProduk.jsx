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
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

export default function ListProduk() {
  const [ListProduk, setListProduk] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getListProduk = async () => {
    await fetch('http://10.235.151.19:8000/api/product/list', {
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
          <TouchableOpacity style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
            <Image
              source={{
                uri: `${item.image}`,
                headers: {
                  Pragma: 'no-cache',
                },
              }}
              style={{width: 100, height: 100, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
