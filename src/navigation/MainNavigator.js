import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import ChatScreen from '../screens/ChatScreen';
import Comment from '../screens/Comment';
import EditProfile from '../screens/EditProfile';
import Home from '../screens/Home';
import Login from '../screens/Login';
import OtherProfile from '../screens/OtherProfile';
import Profile from '../screens/Profile';
import Signup from '../screens/Signup';
import Splash from '../screens/Splash';
import UploadPost from '../screens/UploadPost';
import {RoutesName} from '../utils/Strings';
import BottomTabScreen from './BottomTab';

import {useSelector} from 'react-redux';
import {SocketProvide} from '../socket/socket';
import MessageScreen from '../screens/MessageScreen';
import GallaryScreen from '../screens/GallaryScreen';

const Stack = createNativeStackNavigator();
const MainNavigator = () => {
  const authData = useSelector(state => state.auth.data);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={RoutesName.Splash} component={Splash} />
        <Stack.Screen name={RoutesName.Login} component={Login} />
        <Stack.Screen name={RoutesName.Signup} component={Signup} />

        <Stack.Screen name={RoutesName.Home} component={Home} />
        <Stack.Screen name={RoutesName.UploadPost} component={UploadPost} />
        <Stack.Screen name={RoutesName.Profile} component={Profile} />
        <Stack.Screen name={RoutesName.BottomTab} component={BottomTabScreen} />
        <Stack.Screen name={RoutesName.Comment} component={Comment} />
        <Stack.Screen name={RoutesName.EditProfile} component={EditProfile} />
        <Stack.Screen name={RoutesName.OtherProfile} component={OtherProfile} />
        <Stack.Screen name={RoutesName.ChatScreen} component={ChatScreen} />
        <Stack.Screen
          name={RoutesName.GallaryScreen}
          component={GallaryScreen}
        />
        <Stack.Screen
          name={RoutesName.MessageScreen}
          component={MessageScreen}
        />
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
