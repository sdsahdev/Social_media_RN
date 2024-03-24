import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import UploadPost from '../screens/UploadPost';
import { Colors } from '../utils/Colors';

const Tab = createBottomTabNavigator();

const TabButton = ({item, onPress, accessibilityState}) => {
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
      textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.5}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[
            StyleSheet.absoluteFillObject,
            {backgroundColor: item.color, borderRadius: 16},
          ]}></Animatable.View>
        <View
          style={[
            styles.btn,
            {backgroundColor: focused ? null : item.alphaClr},
          ]}>
          <Image
            source={item.type}
            style={{
              width: wp(6),
              height: hp(4),
              marginHorizontal: wp(2),
              tintColor: focused ? '#fff' : Colors.dark_theme4,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            resizeMode="center"
          />
          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text style={{color: '#fff', paddingHorizontal: 8}}>
                {item.label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const BottomTabScreen = () => {
  const TabArr = [
    {
      route: 'Home',
      label: 'Home',
      type: require('../Images/house.png'), // Replace with actual image paths
      component: Home,
      color: Colors.dark_theme1,
      alphaClr: Colors.dark_theme2,
    },
    {
      route: 'UploadPost',
      label: 'UploadPost',
      type: require('../Images/more.png'), // Replace with actual image paths
      component: UploadPost,
      alphaClr: Colors.dark_theme2,
      color: Colors.dark_theme1,
    },
    {
      route: 'Profile',
      label: 'Profile',
      type:  require('../Images/user.png'), // Replace with actual image paths
      component: Profile,
      color: Colors.dark_theme1,

      alphaClr: Colors.dark_theme2,
    },
    // {
    //   route: 'Profile',
    //   label: 'Profile',
    //   type: ImagePath.user, // Replace with actual image paths
    //   icon: 'user-circle-o',
    //   component: ProfileScreen,
    //   color: Colors.blue,
    //   alphaClr: Colors.sky,
    // },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {TabArr.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.route}
          component={item.component}
          options={{
            tabBarStyle: {
              position: 'absolute',
              bottom: wp(7),
              right: wp(4),
              left: wp(4),
              borderRadius: wp(3),
              // backgroundColor: 'yellow',
              alignSelf: 'center',
              alignItems: 'center',
              // flex: 1,
              justifyContent: 'center',
              height: hp(7),
              paddingBottom: hp(0.1),
              width: '90%',
            },
            tabBarShowLabel: false,
            tabBarButton: props => <TabButton {...props} item={item} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // backgroundColor: '#000',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(1.5),
    borderRadius: wp(3),
  },
  imageStyle: {
    width: wp(4),
    height: hp(6),
    marginRight: 8,
  },
});
export default BottomTabScreen;
