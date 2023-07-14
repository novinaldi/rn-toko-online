import {Text, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Beranda from './Beranda';

function ListContact() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Halaman Cari Produk</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Halaman Untuk Akun</Text>
    </View>
  );
}

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen() {
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
          component={ListContact}
          options={() => ({
            tabBarLabel: 'Catalog',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="view-dashboard"
                color={color}
                size={26}
              />
            )
          })}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Akun',
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
