import React, {useState, useCallback} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Signup from './Signup';
import Login from './Login';
import {setAuthdata, setToken} from '../redux/Slice/AuthSlice';
import {Colors} from '../utils/Colors';
import {ImagePath} from '../utils/Strings';
import Loader from '../components/Loader';

const SigninOption = ({navigation}) => {
  const optionvalue1 = useSharedValue(wp(0));
  const optionvalue2 = useSharedValue(wp(100));
  const optionvalue3 = useSharedValue(wp(-100));

  const opstionStyle1 = useAnimatedStyle(() => ({
    transform: [{translateX: optionvalue1.value}],
  }));
  const opstionStyle2 = useAnimatedStyle(() => ({
    transform: [{translateX: optionvalue2.value}],
  }));
  const opstionStyle3 = useAnimatedStyle(() => ({
    transform: [{translateX: optionvalue3.value}],
  }));

  const clickonBack = useCallback(() => {
    optionvalue1.value = withDelay(0, withSpring(0));
    optionvalue2.value = withDelay(0, withSpring(wp(100)));
    optionvalue3.value = withDelay(0, withSpring(wp(-100)));
  }, [optionvalue1, optionvalue2, optionvalue3]);

  const goRegister = useCallback(() => {
    optionvalue1.value = withDelay(0, withSpring(wp(100)));
    optionvalue2.value = withDelay(0, withSpring(wp(200)));
    optionvalue3.value = withDelay(0, withSpring(wp(0)));
  }, [optionvalue1, optionvalue2, optionvalue3]);

  return (
    <ImageBackground
      resizeMode="stretch"
      style={styles.container}
      source={ImagePath.blurBg}>
      {/* register part */}
      <Animated.View style={[styles.animatedView, opstionStyle3]}>
        <Signup onClicks={clickonBack} navigation={navigation} />
      </Animated.View>
      {/* options */}
      <Animated.View style={[styles.animatedView, opstionStyle1]}>
        <TouchableOpacity
          activeOpacity={0.1}
          onPress={() => {
            optionvalue1.value = withDelay(0, withSpring(wp(-100)));
            optionvalue2.value = withDelay(0, withSpring(wp(0)));
            optionvalue3.value = withDelay(0, withSpring(wp(-200)));
          }}
          style={[styles.optionButton, {backgroundColor: Colors.blue1}]}>
          <Text style={styles.btntxt}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goRegister}
          style={[styles.optionButton, {backgroundColor: Colors.blue5}]}>
          <Text style={styles.btntxt}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
      {/* login part */}
      <Animated.View style={[styles.animatedView, opstionStyle2]}>
        <Login
          onClicks={clickonBack}
          onGoregister={goRegister}
          navigation={navigation}
        />
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedView: {
    width: '90%',
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  optionButton: {
    width: '90%',
    height: hp(8),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: wp(2),
  },
  btntxt: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SigninOption;
