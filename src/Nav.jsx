import {TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DetailProduk from './DetailProduk';
import Beranda from './Beranda';
import Catalog from './Catalog';
import UserData from './UserData';
import LoginPage from './LoginPage';

const Stack = createNativeStackNavigator();
const navOptions = ({navigation}) => ({
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
const navOptionsLoginPage = ({navigation}) => ({
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

function HomeScreen() {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      barStyle={{backgroundColor: '#98EECC'}}
      activeColor="#1D5B79">
      <Tab.Screen
        name="Beranda"
        component={Beranda}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Katalog"
        component={Catalog}
        options={() => ({
          tabBarLabel: 'Catalog',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              color={color}
              size={26}
            />
          ),
        })}
      />

      <Tab.Screen
        name="UserData"
        component={UserData}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({color}) => (
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
          options={{
            headerTitle: 'Halaman Login',
            headerStyle: {
              backgroundColor: '#98EECC',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Nav;
