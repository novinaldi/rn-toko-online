import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ImageBackground, ToastAndroid } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

export default function DetailOrder({ route, navigation }) {
	const [order, setData] = useState([]);
	const [detail, setDetail] = useState([]);
	const [rekening, setRekening] = useState([]);
	const [photo, setPhoto] = useState(null);
	const [cover, setCover] = useState('https://picsum.photos/700');

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
				setCover(response.assets[0].uri);
				console.info(response);
			}
		});
	}

	// count jumlah order
	const JumlahOrder = () => {
		let jumlah = 0;
		detail.forEach((item) => {
			// count jumlah order, convert qty to number
			jumlah += parseInt(item.qty);
		});
		// return Text Component to display jumlah order
		return <Text style={{
			fontSize: 16,
			marginVertical: 5,
		}}>Jumlah Produk: {jumlah}</Text>;

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
		}}>Total Harga: Rp. {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>;
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

		console.log('url: ', url);
		// upload bukti pembayaran to server
		await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Authorization': 'Bearer ' + token_login
			},
			body: createFormData(photo, { invoice: order.invoice }),
		})
			.then((response) => response.json())
			.then((json) => {
				// if json error is Unauthorized, then redirect to LoginPage
				if (json.error == 'Unauthorised') {
					navigation.navigate('LoginPage');
				}

				if(json.success == true) {
					ToastAndroid.show(json.message, ToastAndroid.SHORT);
					navigation.navigate('Order');
				}
			})
			.catch((error) => {
				// show error message from server
				console.error(`Error: ${error.name} : ${error.message}`);
			});
	}

	// get data rekening
	const getDataRekening = async () => {
		// get token login
		let token_login = await AsyncStorage.getItem('@token_login');
		await fetch(`${API_URL}/rekening`, {
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
				console.log(json);
				if(json.status == 'success') {
					setRekening(json.data);
				}else{
					ToastAndroid.show(json.message, ToastAndroid.SHORT);
				}
			})
	}
	useFocusEffect(
		useCallback(() => {
			getOrderData();
			getDataRekening();
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
			<Divider />
			<Card mode="elevated">
				<Card.Title title="Rekening Pembayaran"/>
				<Card.Content>
					<Text variant="titleMedium">No. Rekening { rekening.bank_name }: { rekening.no_rekening} </Text>
					<Text variant="titleSmall">Atas Nama: { rekening.atas_nama} </Text>
					<Divider style={{ marginVertical: 2 }} />
					<Text style={{ marginVertical: 5 }} variant="bodyMedium">
						Harap melakukan pembayaran ke No. Rekening diatas sesuai nominal yang tertera dan Upload bukti pembayarannya dengan Tombol dibawah, pembayaran akan dikonfirmasi dalam hari kerja.
					</Text>
					<Text style={{ marginVertical: 5 }} variant="bodyMedium">
						Terima Kasih
					</Text>
				</Card.Content>
				<Card.Cover source={{ uri: cover }} style={{ paddingHorizontal: 10 }} />
				<Card.Actions>
					<Button icon="camera" onPress={handleChoosePhoto}>Upload Bukti Pembayaran</Button>
					<Button icon="upload" mode="contained" onPress={uploadBuktiBayar}>Submit</Button>
				</Card.Actions>
			</Card>
			
		</SafeAreaView>
	);
}