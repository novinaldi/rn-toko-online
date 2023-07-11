import {View, Text, TouchableOpacity, Button} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './HomeScreen';
import DetailProduk from './DetailProduk';

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

function Nav() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Nav;
