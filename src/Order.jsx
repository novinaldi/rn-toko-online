import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { Button, Divider, List, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Order({ route, navigation }) {

	const [data, setData] = useState([]);

	const getOrderData = async () => {
		// get token login
		let token_login = await AsyncStorage.getItem('@token_login');

		// fetch data order
		await fetch(`${API_URL}/order`, {
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
				setData(json.data);
			})
			.catch((error) => console.error(error));
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
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View>
						<List.Item
							title={"Invoice # " + item.invoice}
							description={"Total: Rp. " + item?.subtotal?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
							// left={props => <List.Icon {...props} icon="cart" />}
							right={props => {
								if(item.status_order_id == 1){
									return (<Button {...props} mode="contained" onPress={() => {{
										navigation.navigate('DetailOrder', {
											id: item.id,
										});
									}}}>Bayar</Button>);
								}

								return (<Button {...props} mode="contained" onPress={() => {{
									navigation.navigate('LihatInvoice', {
										id: item.id,
									});
								}}}>Lihat Invoice</Button>);
							}}
						/>
						<Divider />
					</View>
				)}
			/>
		</SafeAreaView>
	);
}