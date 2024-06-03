import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {ImagePath, RoutesName} from '../utils/Strings';
import BottomTabScreen from './BottomTab';
import {useSelector} from 'react-redux';
import {SocketProvide} from '../socket/socket';
import MessageScreen from '../screens/MessageScreen';
import GallaryScreen from '../screens/GallaryScreen';
import ListWithoutChat from '../screens/ListWithoutChat';
import ChatDetails from '../screens/ChatDetails';
import VideoCalling from '../screens/VideoCalling';
import SigninOption from '../screens/SigninOption';
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import {Colors} from '../utils/Colors';
import SapratePost from '../screens/SapratePost';
import branch from 'react-native-branch';
import Loader from '../components/Loader';
import {Image} from 'react-native-animatable';
import DublicateSplash from '../screens/DublicateSplash';
import {setDate} from 'date-fns';
import SettingScreen from '../screens/SettingScreen';

const Stack = createNativeStackNavigator();
const linking = {
  prefixes: ['myapp://', 'https://3gig1.app.link'],
  config: {
    screens: {
      SapratePost: 'SapratePost/:userId',
      Splash: 'Splash/:userId',
    },
  },
};

const MainNavigator = () => {
  const navigationRef = useRef();
  const [initializing, setInitializing] = useState(true);
  const [idData, setidData] = useState('');
  const [isAnyData, setisAnyData] = useState(false);
  const [branchError, setBranchError] = useState(false);

  const handleBranchSubscription = () => {
    return branch.subscribe(({error, params, uri}) => {
      if (error) {
        if (!error.includes('branch_force_new_session')) {
          console.error('Error from Branch: ' + error);
        }
        setBranchError(true);
        return;
      }
      // handle deep link data
      console.log('Branch link params:', params);

      if (params.flix) {
        const userId = params.flix;
        setidData(userId);
        console.log(`Navigating to SapratePost with userId: ${userId}`);
        if (!initializing) {
          navigationRef.current?.navigate('SapratePost', {userId});
        }
      }
      setisAnyData(true);
    });
  };

  useEffect(() => {
    const unsubscribe = handleBranchSubscription();

    return () => {
      unsubscribe();
    };
  }, [initializing]);

  useEffect(() => {
    if (branchError) {
      setBranchError(false);
      const unsubscribe = handleBranchSubscription();
      return () => {
        unsubscribe();
      };
    }
  }, [branchError]);

  useEffect(() => {
    const example = async () => {
      try {
        setisAnyData(true);
        const response = await changeNavigationBarColor(Colors.black3, false);
        console.log(response, '===changeNavigationBarColor=='); // {success: true}
      } catch (e) {
        console.log(e); // {success: false}
      }
    };
    example();
  }, []);

  const authData = useSelector(state => state.auth.data);

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        setInitializing(false);
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAnyData ? (
          <>
            <Stack.Screen
              name={RoutesName.Splash}
              component={Splash}
              initialParams={{userId: idData}}
            />
            <Stack.Screen
              name={RoutesName.Login}
              component={Login}
              initialParams={{visible: true}}
            />
            <Stack.Screen name={RoutesName.Signup} component={Signup} />
            <Stack.Screen name={RoutesName.Home} component={Home} />
            <Stack.Screen name={RoutesName.UploadPost} component={UploadPost} />
            <Stack.Screen name={RoutesName.Profile} component={Profile} />
            <Stack.Screen
              name={RoutesName.BottomTab}
              component={BottomTabScreen}
            />
            <Stack.Screen name={RoutesName.Comment} component={Comment} />
            <Stack.Screen
              name={RoutesName.EditProfile}
              component={EditProfile}
            />
            <Stack.Screen
              name={RoutesName.OtherProfile}
              component={OtherProfile}
            />
            <Stack.Screen name={RoutesName.ChatScreen} component={ChatScreen} />
            <Stack.Screen
              name={RoutesName.ChatDetails}
              component={ChatDetails}
            />
            <Stack.Screen
              name={RoutesName.VideoCalling}
              component={VideoCalling}
            />
            <Stack.Screen
              name={RoutesName.SigninOption}
              component={SigninOption}
            />
            <Stack.Screen
              name={RoutesName.SapratePost}
              component={SapratePost}
            />
            <Stack.Screen
              name={RoutesName.ListWithoutChat}
              component={ListWithoutChat}
            />
            <Stack.Screen
              name={RoutesName.GallaryScreen}
              component={GallaryScreen}
            />
            <Stack.Screen
              name={RoutesName.MessageScreen}
              component={MessageScreen}
            />
            <Stack.Screen
              name={RoutesName.SettingScreen}
              component={SettingScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name={RoutesName.DublicateSplash}
            component={DublicateSplash}
          />
        )}
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

export default MainNavigator;
