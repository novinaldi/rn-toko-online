import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Button, Divider, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native-ui-lib";
import Moment from "moment";

export default function LihatInvoice({ route, navigation }) {
	const [order, setData] = useState([]);
	const [detail, setDetail] = useState([]);
	const [alamat, setAlamat] = useState([]);

	const getOrderData = async () => {
		// get token login
		let token_login = await AsyncStorage.getItem('@token_login');

		// fetch data order
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
			setAlamat(json.data.alamat);
			console.info("Info Oder: ", json.data.order);
			console.info("Info Detail Oder: ", json.data.detail_order);
			console.info("Info Alamat: ", json.data.alamat);
		})
	}

	useFocusEffect(
		useCallback(() => {
			getOrderData();
		}
		, [])
	);

	const ItemList = () => {
		return detail.map((item, index) => {
			return <List.Item 
				title={item.product.name} 
				description={"Qty: " + item.qty.toString()} 
				right={props => <Text style={{alignSelf: 'right', fontWeight: 'bold',}}>{"\nRp. " + item.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </Text>}
				key={index} 
			/>
		})
	}

	return (
		<SafeAreaView style={{flex: 1,padding: 5,}}>
			<List.Section>
				<List.Subheader style={{ fontSize: 20 }}>Detail Invoice</List.Subheader>
				<View style={{paddingHorizontal: 16,}}>
					<Text style={{fontSize: 16, }}>Invoice # {order.invoice}</Text>
					<Text style={{fontSize: 16, }}>Total: Rp. {order?.subtotal?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
					<Text style={{fontSize: 16, }}>Status: {order?.status_order?.name}</Text>
					<Text style={{fontSize: 16, }}>Tanggal: {Moment(order?.updated_at).format('D/MMM/YYYY')}</Text>
				</View> 
			</List.Section>
			<Divider />
			<List.Section>
				<List.Subheader style={{ fontSize: 20 }}>Alamat Pengiriman</List.Subheader>
				
				<View style={{ paddingHorizontal: 16, paddingBottom: 3}}>
					<Text style={{fontSize: 16}}>Kontak Penerima :</Text>
					<Text style={{fontSize: 16, }}>Nama: {order?.user?.name}</Text>
					<Text style={{fontSize: 16, }}>Email: {order?.user?.email}</Text>
				</View>

				<View style={{ paddingHorizontal: 16, paddingVertical: 3 }}>
					<Text style={{fontSize: 16}}>Alamat :</Text>
					<Text>{alamat?.detail}</Text>
				</View>

				<View style={{ paddingHorizontal: 16, paddingVertical: 3 }}>
					<Text style={{fontSize: 16}}>Kota/Kabupaten :</Text>
					<Text>{alamat?.city?.title}</Text>
				</View>

				<View style={{ paddingHorizontal: 16, paddingVertical: 3 }}>
					<Text style={{fontSize: 16}}>Provinsi :</Text>
					<Text>{alamat?.city?.province?.title}</Text>
				</View>
			</List.Section>
			<Divider />
			<List.Section>
				<List.Subheader style={{ fontSize: 20 }}>Detail Pesanan</List.Subheader>
				<ItemList />
			</List.Section>
			<Divider />
			<List.Section>
				<List.Subheader style={{ fontSize: 20 }}>Detail Biaya</List.Subheader>
				<List.Item
					title="Subtotal Produk"
					right={props => <Text>{"Rp. " + (order?.subtotal - order?.ongkir).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </Text>}
				/>
				<List.Item
					title="Ongkos Kirim"
					right={props => <Text>{"Rp. " + order?.ongkir?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </Text>}
				/>
				<List.Item
					title="Total Pembayaran"
					right={props => <Text>{"Rp. " + order?.subtotal?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </Text>}
				/>
			</List.Section>
		</SafeAreaView>
	);
}