import {StyleSheet, Text, ToastAndroid, View, SafeAreaView, RefreshControl, TouchableOpacity, Image, FlatList,} from 'react-native';
import {
  PaperProvider, TextInput, MD3LightTheme as DefaultTheme, ActivityIndicator} from 'react-native-paper';
import React, { useState } from 'react';
import API_URL from './config';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    secondary: 'yellow',
  },
};

export default function Catalog({ navigation }) {
  const [cariProduk, setCariProduk] = useState();
  const [loading, setLoading] = useState(false);
  const [listProduk, setListProduk] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  const getSearchProduk = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/product/list?search=${cariProduk}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const json = await response.json();
      setListProduk(json.data);
      setLoading(false);

      setIsDataEmpty(json.data.length === 0);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        'Terjadi kesalahan saat mengambil data',
        ToastAndroid.SHORT,
      );
    }
  };

  const renderProdukItem = ({ item, index }) => {
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
    <PaperProvider theme={theme}>
      <View style={{ backgroundColor: theme.colors.secondary }}>
        <TextInput
          style={{ backgroundColor: 'white' }}
          label="Search Catalog..."
          value={cariProduk}
          onChangeText={value => setCariProduk(value)}
          left={<TextInput.Icon icon="text-search" color="black" />}
          onSubmitEditing={getSearchProduk}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginTop: 5,
          }}>
          {isDataEmpty ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text>Data tidak ditemukan</Text>
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={() => {
                    setRefresh(true);
                    getSearchProduk();
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
          )}
        </SafeAreaView>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
