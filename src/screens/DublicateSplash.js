import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ImagePath, RoutesName} from '../utils/Strings';
import FastImage from 'react-native-fast-image';
const DublicateSplash = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <FastImage source={ImagePath.logoicon} />
    </View>
  );
};

export default DublicateSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
