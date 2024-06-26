import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import Comment from '../screens/Comment';
import EditProfile from '../screens/EditProfile';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import Signup from '../screens/Signup';
import Splash from '../screens/Splash';
import UploadPost from '../screens/UploadPost';
import { RoutesName } from '../utils/Strings';
import BottomTabScreen from './BottomTab';

const Stack = createNativeStackNavigator();
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'
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
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
