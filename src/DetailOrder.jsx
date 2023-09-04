import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ImageBackground, ToastAndroid } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

export default function DetailOrder({ route, navigation }) {
	const [order, setData] = useState([]);
	const [detail, setDetail] = useState([]);

	const [photo, setPhoto] = useState(null);

	const getOrderData = async () => {
		// get token login
		let token_login = await AsyncStorage.getItem('@token_login');
		await fetch(`${API_URL}/order/` + route.params.id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token_login
			},
		})
			.then((response) => response.json())
			.then((json) => {
				// if json error is Unauthorized, then redirect to LoginPage
				if (json.error == 'Unauthorised') {
					navigation.navigate('LoginPage');
				}
				setData(json.data.order);
				setDetail(json.data.detail_order);
				console.log(json);
			})
	}

	const handleChoosePhoto = () => {
		console.log('upload bukti pembayaran');
		launchImageLibrary({ noData: true }, (response) => {
			console.log(response);
			if(response) {
				setPhoto(response.assets[0]);
				console.info(response);
			}
		});
	}

	// count jumlah order
	const JumlahOrder = () => {
		let jumlah = 0;
		detail.forEach((item) => {
			jumlah += item.qty;
		});
		// return Text Component to display jumlah order
		return <Text style={{
			fontSize: 16,
			marginVertical: 5,
		}}>Jumlah: {jumlah}</Text>;

	}

	// count total harga
	const TotalHarga = () => {
		let total = 0;
		detail.forEach((item) => {
			total += item.product.price * item.qty;
		});
		// convert ongkir to number
		let ongkir = parseInt(order.ongkir);
		// add ongkir to total
		total += ongkir;
		// return Text Component to display total harga
		return <Text style={{
			fontSize: 16,
			marginVertical: 5,
		}}>Total Harga: {total}</Text>;
	}

	// create form data
	const createFormData = (photo, body) => {
		const data = new FormData();

		if (photo) {
			data.append('photo', {
				name: photo.fileName,
				type: photo.type,
				uri: photo.uri,
			});
		}

		Object.keys(body).forEach((key) => {
			data.append(key, body[key]);
		});

		console.info(data);
		return data;
	};

	// upload bukti pembayaran
	const uploadBuktiBayar = async () => {
		// get token login
		let token_login = await AsyncStorage.getItem('@token_login');

		var url = API_URL + `/order/` + route.params.id + `/proof`;

		// upload bukti pembayaran to server
		await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token_login
			},
			body: createFormData(photo, { invoice: order.invoice }),
		})
			.then((response) => {
				console.log(response);
				return response.json();
			})
			.then((json) => {
				// if json error is Unauthorized, then redirect to LoginPage
				if (json.error == 'Unauthorised') {
					navigation.navigate('LoginPage');
				}
				ToastAndroid.show(json.message, ToastAndroid.LONG);
				console.log(json);
			})
			.catch((error) => {
				// show error message from server
				console.error(`Error: ${error.name} : ${error.message}`);
			});
	}

	useFocusEffect(
		useCallback(() => {
			getOrderData();
		}
		, [])
	);

	return (
		<SafeAreaView style={{
			flex: 1,
			padding: 5,
		}}>
			<Text style={{
				fontSize: 20,
				fontWeight: 'bold',
				marginBottom: 10,
			}}>Detail Order</Text>
			<Divider />
			<Text style={{
				fontSize: 16,
				marginVertical: 5,
			}}>Invoice: {order.invoice}</Text>
			<JumlahOrder />
			<TotalHarga />
			
			{/* text upload bukti */}
			<Text style={{
				fontSize: 20,
				fontWeight: 'bold',
				marginVertical: 10,
			}}>Upload Bukti Pembayaran</Text>
			<Divider />
			{/* view image photo */}
			<ImageBackground source={{ uri: photo?.uri }} style={{
				width: 200,
				height: 200,
				marginVertical: 10,
			}} />
			{/* button to choose photo */}
			<Button icon="camera" mode="contained" onPress={handleChoosePhoto} />
			<Divider />
			{/* Button to upload bukti pembayaran */}
			<Button icon="upload" mode="contained" onPress={uploadBuktiBayar}>Upload Bukti Pembayaran</Button>
		</SafeAreaView>
	);
}