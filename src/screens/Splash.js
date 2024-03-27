import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
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
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

});
