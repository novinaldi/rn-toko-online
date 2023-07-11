import {StyleSheet, Text, View, ImageBackground, StatusBar} from 'react-native';
import React from 'react';
import ListProduk from './ListProduk';

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#98EECC"
        animated={true}
      />
      <View style={styles.header}>
        <ImageBackground
          source={require('./img/home.png')}
          style={styles.imgBg}
          resizeMode="contain"></ImageBackground>
        <View style={styles.textBg}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Cari Kebutuhan Olahraga Kamu di Sini
          </Text>
          <Text
            style={{
              color: 'black',
            }}>
            Alat olahraga disini terjamin kualitasnya dan tentunya barangnya
            juga original bukan kw.
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginTop: 10,
              color: 'black',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            --- TACELAK CLOTHS ---
          </Text>
        </View>
        <ListProduk navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    flex: 1 / 3,
    flexDirection: 'row',
    backgroundColor: '#98EECC',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
  },
  imgBg: {flex: 1, justifyContent: 'center', elevation: 5},
  textBg: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
});
