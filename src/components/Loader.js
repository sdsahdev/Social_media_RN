import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Colors} from '../utils/Colors';

const Loader = ({visible}) => {
  return (

      <Modal isVisible={visible} backdropColor="rgba(0,0,0,.5)" style={{justifyContent:'center', alignItems:'center'}}>
        <View style={styles.loaderview}>
            <ActivityIndicator size={'small'}/>
        </View>
      </Modal>

  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderview: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 15,

    justifyContent: 'center',
  },
});
