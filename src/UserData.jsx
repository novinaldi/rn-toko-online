import {
	StyleSheet,
	View,
	ActivityIndicator,
	RefreshControl,
	ToastAndroid,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { Divider, Text, List, Button } from 'react-native-paper';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import API_URL from './config';

export default function UserData({ navigation }) {
	const [loading, setLoading] = useState(false);
	const [errorToken, setErrorToken] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [iduser, setiduser] = useState();
	const [nameuser, setnameuser] = useState();
	const [emailuser, setemailuser] = useState();
	const [roleuser, setroleuser] = useState();

	const getUserDataLogin = async () => {
		let token_login = await AsyncStorage.getItem('@token_login');
		try {
			const response = await fetch(`${API_URL}/user`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + token_login,
				},
			});
			const json = await response.json();
			if (json.error) {
				// navigate to LoginPage
				navigation.navigate('LoginPage');
			} else {
				setiduser(json.data.id);
				setnameuser(json.data.name);
				setemailuser(json.data.email);
				setroleuser(json.data.role);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const doKeluarAkun = async () => {
		let token_login = await AsyncStorage.getItem('@token_login');
		try {
			const response = await fetch(`${API_URL}/logout`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + token_login,
				},
			});
			const json = await response.json();
			if (json) {
				navigation.goBack();
			}
		} catch (error) {
			console.log(error);
		}
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			getUserDataLogin();
		}, []),
	);

	return loading ? (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator size="large" color="blue" />
		</View>
	) : (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			{/* list item nama user with account icon */}
			<List.Item
				title="Nama"
				description={nameuser}
				left={(props) => <List.Icon {...props} icon="account" />}
			/>
			
			{/* divider the item */}
			<Divider />

			{/* list item email user with email icon */}
			<List.Item
				title="Email"
				description={emailuser}
				left={(props) => <List.Icon {...props} icon="email" />}
			/>

			{/* logout button */}
			<Button
				mode="contained"
				icon="logout"
				onPress={() => doKeluarAkun()}
			>
				Keluar
			</Button>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: 'white',
	},
	contentData: {
		marginTop: 25,
		marginHorizontal: 25,
		borderBottomWidth: 1,
		borderColor: '#7F167F',
	},
});
