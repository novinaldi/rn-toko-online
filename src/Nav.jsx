import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DetailProduk from './DetailProduk';
import Beranda from './Beranda';
import Catalog from './Catalog';
import UserData from './UserData';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Keranjang from './Keranjang';
import Checkout from './Checkout';
import Order from './Order';
import DetailOrder from './DetailOrder';
import AddAlamat from './AddAlamat.jsx';
import LihatInvoice from './LihatInvoice.jsx';

const Stack = createNativeStackNavigator();
const navOptions = ({ navigation }) => ({
	headerStyle: {
		backgroundColor: '#98EECC',
	},
	headerTitleStyle: {
		color: '#000',
	},
	headerTitleAlign: 'center',
	headerLeft: () => (
		<TouchableOpacity onPress={() => navigation.goBack()}>
			<Icon name="arrow-left" color="black" size={20} />
		</TouchableOpacity>
	),
});

const backToHome = ({ navigation }) => ({
	headerStyle: {
		backgroundColor: '#98EECC',
	},
	headerTitleStyle: {
		color: '#000',
	},
	headerTitleAlign: 'center',
	headerLeft: () => (
		<TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
			<Icon name="home" color="black" size={20} />
		</TouchableOpacity>
	),
});

function HomeScreen() {
	const Tab = createMaterialBottomTabNavigator();
	return (
		<Tab.Navigator
			barStyle={{ backgroundColor: '#98EECC' }}
			activeColor="#1D5B79">
			<Tab.Screen
				name="Beranda"
				component={Beranda}
				options={{
					tabBarLabel: 'Beranda',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="home" color={color} size={26} />
					),
				}}
			/>

			<Tab.Screen
				name="Katalog"
				component={Catalog}
				options={() => ({
					tabBarLabel: 'Catalog',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="view-dashboard"
							color={color}
							size={26}
						/>
					),
				})}
			/>

			<Tab.Screen
				name="Keranjang"
				component={Keranjang}
				options={() => ({
					tabBarLabel: 'Keranjang',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="cart" color={color} size={26} />
					),
				})}
			/>

			<Tab.Screen
				name="Order"
				component={Order}
				options={() => ({
					tabBarLabel: 'Order',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="shopping" color={color} size={26} />
					),
				})}
			/>

			<Tab.Screen
				name="UserData"
				component={UserData}
				options={{
					tabBarLabel: 'User',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="account-plus"
							color={color}
							size={26}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}

function Nav() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator initialRouteName="HomeScreen">
				<Stack.Screen
					name="HomeScreen"
					component={HomeScreen}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="DetailProduk"
					component={DetailProduk}
					options={navOptions}
				/>
				<Stack.Screen
					name="LoginPage"
					component={LoginPage}
					options={backToHome}
				/>
				<Stack.Screen
					name="RegisterPage"
					component={RegisterPage}
					options={{
						headerTitle: 'Registrasi Akun',
						headerStyle: {
							backgroundColor: '#98EECC',
						},
						headerTitleStyle: {
							color: '#000',
						},
						headerTitleAlign: 'center',
					}}
				/>
				<Stack.Screen
					name="Checkout"
					component={Checkout}
					options={{
						headerTitle: 'Checkout',
					}}
				/>
				<Stack.Screen
					name="DetailOrder"
					component={DetailOrder}
					options={{
						headerTitle: 'Detail Order',
					}}
				/>

				<Stack.Screen
					name='Alamat'
					component={AddAlamat}
				/>
				
				<Stack.Screen
					name='LihatInvoice'
					component={LihatInvoice}
					options={{
						headerTitle: 'Lihat Invoice',
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default Nav;

