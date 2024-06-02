import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, View, Animated} from 'react-native';
import {useSelector} from 'react-redux';
import {ImagePath, RoutesName} from '../utils/Strings';
import {Colors} from '../utils/Colors';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
const Splash = ({navigation, route}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const userId = route?.params?.userId;
  const authData = useSelector(state => state.auth);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to opacity: 1 (fully visible)
      duration: 3000, // Make it take 3 seconds
      useNativeDriver: true, // Add this line
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    console.log(userId, '==userid==');
    console.log(authData);
    setTimeout(() => {
      if (authData.data == null) {
        navigation.replace(RoutesName.SigninOption);
      } else if (userId) {
        navigation.replace(RoutesName.SapratePost, {userId: userId});
      } else {
        navigation.replace(RoutesName.BottomTab);
      }
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.logo, {opacity: fadeAnim}]}
        source={ImagePath.logoicon}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  logo: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    resizeMode: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
});
