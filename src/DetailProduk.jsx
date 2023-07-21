import {
	ActivityIndicator,
	Image,
	ImageBackground,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
	Alert, ToastAndroid
} from 'react-native';
import { Avatar, Button, Card, Divider, Text } from 'react-native-paper';
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import API_URL from './config';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailProduk({ route, navigation }) {
	const [loading, setLoading] = useState(false);
	const [idProduk, setIdProduk] = useState();
	const [gambar, setGambar] = useState();
	const [namaProduk, setNamaProduk] = useState();
	const [harga, setHarga] = useState(0);
	const [desc, setDesc] = useState();

	const getDetailProduk = async () => {
		await fetch(`${API_URL}/product/` + route.params.id, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				setIdProduk(json.data.id);
				setNamaProduk(json.data.name);
				setGambar(json.data.image);
				setHarga(json.data.price);
				setDesc(json.data.description);
			})
			.catch(e => console.log(e));
	};

	const doInsertToCart = async () => {
		let token_login = await AsyncStorage.getItem('@token_login');
		await fetch(`${API_URL}/cart`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token_login,
			},
			body: JSON.stringify({
				product_id: idProduk,
				qty: 1,
			}),
		})
			.then(response => response.json())
			.then(json => {
				if (json.error) {
					Alert.alert(
						'Warning',
						'Silahkan Anda Login Terlebih Dahulu',
						[
							{ text: 'OK', onPress: () => navigation.navigate('LoginPage') },
						],
					);
				}
				else {
					ToastAndroid.show(`${json.message}`, ToastAndroid.LONG);
					console.log(json);

					// navigate back to previous page
					navigation.goBack();
				}
			})
			.catch(e => console.log(e));
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			getDetailProduk();
			setLoading(false);
		}, []),
	);

	return loading ? (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator size="large" color="red" />
		</View>
	) : (
		<SafeAreaView>
			<Card>
				<Card.Title title={namaProduk} />
				<Card.Cover source={{ uri: gambar ?? 'https://picsum.photos/700' }} resizeMode='contain' />
				<Card.Content>
					<Text variant='titleLarge'>
						Rp. {harga?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
					</Text>
					<Divider />
					<Text variant='bodyMedium'>{desc}</Text>
				</Card.Content>
				<Card.Actions>
					<Button onPress={doInsertToCart}>Tambahkan ke Keranjang</Button>
				</Card.Actions>
			</Card>
		</SafeAreaView>
	);
}
