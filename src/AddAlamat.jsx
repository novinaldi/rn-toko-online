import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { Dropdown } from 'react-native-element-dropdown';

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Text, TextInput } from "react-native-paper";
import { StyleSheet, ToastAndroid } from "react-native";
import { View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

export default function AddAlamat({ route, navigation}){
    // province state
    const [provincies, setListProve] = useState([])

    // city state
    const [city_id, setCity]    = useState(null)

    const [cities, setListCity] = useState([])

    // detail state
    const [detail, onChangeText] = useState(null)

    const getListProvinsi = async () => {
        let token_login = await AsyncStorage.getItem('@token_login');

        await fetch(`${API_URL}/address/province`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token_login
            }
        })
        .then((response) => response.json())
        .then((json) => {
            setListProve(json.data)
            setListCity([])
            setCity(null)
        })
        .catch(err => {
            // check if token_login property exist
            console.error(err);
        })
    }

    const getListKota = async (province) => {
        let token_login = await AsyncStorage.getItem('@token_login');

        await fetch(`${API_URL}/address/city/${province}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token_login
            }
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(province)
            setListCity(json.data)
        })
        .catch(err => {
            // check if token_login property exist
            console.error(err);
        })
    }

    const setAlamatUser = async () => {
        let token_login = await AsyncStorage.getItem('@token_login');
        console.info('city_id :', city_id);
        console.info('detail :', detail);

        await fetch(`${API_URL}/address`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token_login
            },
            body:JSON.stringify({
                city_id: city_id,
                detail: detail,
            })
        })
        .then((response) => response.json())
        .then((json) => {
            ToastAndroid.show(json.message, ToastAndroid.SHORT);
            navigation.goBack()
        })
        .catch(err => {
            console.error(err);
        })
    }

    useFocusEffect(
		useCallback(() => {
			getListProvinsi();
            console.log(cities.length)
		}
		, [])
	);

    return(
        <SafeAreaView style={styles.container}>
            <Text>
                Pilih Provinsi
            </Text>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={[styles.placeholderStyle, styles.colour]}
                selectedTextStyle={[styles.selectedTextStyle, styles.colour]}
                itemTextStyle={styles.colour}
                inputSearchStyle={[styles.inputSearchStyle, styles.colour]}
                data={provincies}
                search
                labelField='title'
                valueField='province_id'
                placeholder='Pilih Provinsi'
                onChange={ item => getListKota(item.province_id) }
            />
            <Divider />
            <Text>
                Pilih Kota
            </Text>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={[styles.placeholderStyle, styles.colour]}
                selectedTextStyle={[styles.selectedTextStyle, styles.colour]}
                itemTextStyle={styles.colour}
                inputSearchStyle={[styles.inputSearchStyle, styles.colour]}
                data={cities}
                disabled={cities.length == 0}
                search
                labelField='title'
                valueField='city_id'
                placeholder='Pilih Kota'
                onChange={ item => setCity(item.city_id) }
            />
            <Divider />

            <View>
                <Text>
                    Detail Alamat
                </Text>
                <TextInput
                    style={[{ backgroundColor: "white"}, styles.colour]}
                    onChangeText={onChangeText}
                    value={detail}
                />
            </View>
            <Divider />
            <Button onPress={() => {
                setAlamatUser();
            }}>
                Simpan
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    colour: {
        color: 'black'
    }
  });