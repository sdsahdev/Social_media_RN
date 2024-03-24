import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { Colors } from '../utils/Colors';
import { ImagePath, RoutesName } from '../utils/Strings';
const Splash = ({navigation}) => {
  const authData = useSelector(state => state.auth)
  useEffect(()=> {

    console.log(authData);
    setTimeout(() => {
      if(authData.data == null){
        navigation.navigate(RoutesName.Login)
      }else{
        navigation.navigate(RoutesName.BottomTab)
      }
    }, 2000);
  },[])
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={ImagePath.logoicon} />
      {/* <Text style={styles.logoText}>Welcome Back {`\n`} to Sosal</Text>
      <CustomTextInput
        icon={require('../Images/mail.png')}
        placeholder={'Enter Email'}
      />
      <CustomTextInput
        icon={require('../Images/padlock.png')}
        placeholder={'Enter Password'}
      />

      <LinearGradient
        colors={[Colors.dark_theme2, Colors.dark_theme3]}
        style={styles.button}>
        <TouchableOpacity
          style={[
            styles.button,
            {justifyContent: 'center', alignItems: 'center', margin:0},
          ]}>
          <Text style={styles.btntxt}>Login</Text>
        </TouchableOpacity>
      </LinearGradient> */}
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  btntxt: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: '50%',
    height: '30%',
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: 'red',
    margin: wp(10),
  },
  logoText: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  button: {
    width: '90%',
    height: hp(6),
    alignSelf: 'center',
    margin: wp(4),
    borderRadius: 10,
  },
});
