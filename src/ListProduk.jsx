import React, {useState, useCallback} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import API_URL from './config';

export default function ListProduk({navigation}) {
  const [listProduk, setListProduk] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getListProduk = async () => {
    try {
      const response = await fetch(`${API_URL}/product/list`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const json = await response.json();
      setListProduk(json.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        'Terjadi kesalahan saat mengambil data',
        ToastAndroid.SHORT,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getListProduk();
    }, []),
  );

  const renderProdukItem = ({item, index}) => {
    if (!item) {
      return null; // Tidak melakukan render jika objek item undefined
    }

    const navigateToDetail = () => {
      navigation.navigate('DetailProduk', {
        id: item.id,
        idProduk: item.id,
      });
    };

    return (
      <TouchableOpacity
        onPress={navigateToDetail}
        style={styles.produkContainer}>
        <Image
          source={{
            uri: `${item.image}`,
            headers: {
              Pragma: 'no-cache',
            },
          }}
          style={styles.produkImage}
        />
        <Text style={styles.produkName}>
          {item.name.length > 20
            ? `${item.name.substring(0, 20)} ...`
            : item.name}
        </Text>
        <Text style={styles.produkPrice}>
          {`Rp ${item.price?.toLocaleString('id-ID') || '-'}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <SafeAreaView style={styles.safeAreaContainer}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                  setRefresh(true);
                  getListProduk();
                  setRefresh(false);
                }}
              />
            }
            data={listProduk}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            keyExtractor={item => item.id.toString()}
            renderItem={renderProdukItem}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  produkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 0,
    borderColor: '#98EECC',
    elevation: 1,
  },
  produkImage: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    marginTop: 3,
  },
  produkName: {
    color: '#071952',
    fontSize: 14,
    fontWeight: 'bold',
  },
  produkPrice: {
    paddingBottom: 5,
    fontWeight: 'bold',
    color: '#862B0D',
  },
});
