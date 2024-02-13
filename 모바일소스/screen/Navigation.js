
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ListScreen from '../screens/ListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainScreen from '../screens/MainScreen';
import LogoTitle from '../screens/LogoTitle';
import {Image} from 'react-native';
import home from '../../assets/home.png';
import list from '../../assets/list.png';
import user from '../../assets/user.png';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'black', 
          height: 60,
        },
        tabBarLabelStyle: {
          color: 'white', 
          fontSize: 16,
        },
      }}>
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          headerTitle: '이용내역',
          tabBarLabel: '이용내역',
          tabBarIcon: ({color, size}) => (
            <Image
              source={list}
              style={{tintColor: color, width: size, height: size}}
            />
          ),
          tabBarActiveTintColor: '#be289d', 
        }}
      />
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerTitle: () => <LogoTitle />,
          tabBarLabel: '메인',
          headerStyle: {
            backgroundColor: 'black',
          },
          tabBarIcon: ({color, size}) => (
            <Image
              source={home}
              style={{tintColor: color, width: size, height: size}}
            />
          ),
          tabBarActiveTintColor: '#be289d', 
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '마이페이지',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={user}
              style={{tintColor: color, width: size, height: size}}
            />
          ),
          tabBarActiveTintColor: '#be289d', 
        }}
      />
    </Tab.Navigator>
  );
};
export default Navigation;
