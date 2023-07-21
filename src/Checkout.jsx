import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, ToastAndroid } from "react-native";
import { Button, Divider, List, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast, View } from "react-native-ui-lib";

export default function Checkout({ route, navigation }) {
	// state keranjang
	const [keranjang, setKeranjang] = useState([]);
	// state ongkir
	const [ongkir, setOngkir] = useState(0);
	// state total belanja
	const [totalBelanja, setTotalBelanja] = useState(0);
	// state catatan pembelian
	const [catatanPembelian, setCatatanPembelian] = useState('');
	// state no hp
	const [noHp, setNoHp] = useState('');
	// state invoice
	const [invoice, setInvoice] = useState('');

	// function fetch data checkout
	const fetchCheckout = async () => {
		let token_login = await AsyncStorage.getItem('@token_login');
		await fetch(`${API_URL}/order/checkout`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + token_login,
			},
		})
			.then(response => response.json())
			.then(json => {
				if (json.error == 'Unauthorised') {
					// navigate to LoginPage
					navigation.navigate('LoginPage');
				}
				
				console.log(json);
				setKeranjang(json.data.keranjang);
				setOngkir(json.data.ongkir);
				setTotalBelanja(json.data.total_belanja);
				setInvoice(json.data.invoice);

				// add invoice to header title
				navigation.setOptions({
					title: 'Checkout - ' + json.data.invoice,
				});
			})
			.catch(e => console.log(e));
	}
	// get data checkout
	useFocusEffect(
		useCallback(() => {
			fetchCheckout();
		}, []),
	);
	// return flatlist
	return (
		<SafeAreaView style={
			{
				flex: 1,
				padding: 10,
			}
		}>
			<List.Accordion
				title="Keranjang"
				description={'Total Harga : Rp. ' + totalBelanja?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
			>
				<FlatList
					data={keranjang}
					renderItem={({ item }) => (
						<View>
							<List.Item
								title={item.product.name}
								// description is item.qty x item.product.price
								description={item.qty + ' x Rp. ' + item.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
							/>
							<Divider />
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</List.Accordion>
			<Divider />
			<List.Accordion
				title="Ongkos Kirim"
				// description is "Total Ongkir : " + ongkir.biaya
				description={'Total Ongkir : Rp. ' + ongkir?.biaya?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
			>
				<List.Item title={"Kurir : JNE"} />
				<List.Item title={"Jenis Layanan : " + ongkir?.service} />
				<List.Item title={"Estimasi : " + ongkir?.etd + " Hari"} />
			</List.Accordion>
			<Divider />
			<Text variant="titleMedium">
				Total Pembayaran : Rp. {(totalBelanja + ongkir?.biaya)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
			</Text>
			<Divider />
			<TextInput
				label="Catatan Pembelian"
				multiline={true}
				numberOfLines={3}
				value={catatanPembelian}
				onChangeText={text => setCatatanPembelian(text)}
				mode="outlined"
			/>
			<Divider />
			<TextInput
				label="No HP"
				value={noHp}
				onChangeText={text => setNoHp(text)}
				mode="outlined"
			/>
			<Divider />
			<Button
				style={{ marginTop: 10 }}
				mode="contained"
				onPress={async () => {
					await fetch(API_URL + '/order/checkout/confirm', {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + await AsyncStorage.getItem('@token_login'),
						},
						body: JSON.stringify({
							invoice: invoice,
							pesan: catatanPembelian,
							no_hp: noHp,
							total_bayar: totalBelanja + ongkir?.biaya,
							ongkir: ongkir?.biaya,
						}),
					})
						.then(response => response.json())
						.then(json => {
							console.log(json);
							if (json.success) {
								ToastAndroid.show(
									json.message,
									ToastAndroid.LONG,
								)
								navigation.navigate('Beranda');
							}
						})
						.catch(e => console.log(e));
				}}>
				Place Order
			</Button>
		</SafeAreaView>
	);
}