import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import Modal from 'react-native-modal';
import {Colors} from '../utils/Colors';
import {ImagePath} from '../utils/Strings';
import FastImage from 'react-native-fast-image';

const EditCapsion = ({onClick, onClose, visible, data}) => {
  const [captionedit, setcaptionedit] = useState('');
  const [imageurl, setimageurl] = useState('');
  useEffect(() => {
    setcaptionedit(data?.caption || '');
    setimageurl(data?.imageUrl || '');
  }, [visible]);
  return (
    <Modal
      onRequestClose={() => {
        onClose();
      }}
      visible={visible}
      backdropColor={Colors.modalbg}
      transparent>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Colors.black1,
          bottom: 0,
          position: 'absolute',
          flex: 1,
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            paddingLeft: 20,
          }}>
          <TouchableOpacity onPress={() => onClose()}>
            <Image
              source={ImagePath.closeicon}
              style={{width: 24, height: 24, tintColor: Colors.white}}
            />
          </TouchableOpacity>
          <Text
            style={{fontSize: 20, color: Colors.white, marginHorizontal: 20}}>
            Edit Post
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: 20,
            padding: 10,
            borderWidth: 1,
            height: 100,
            borderRadius: 10,
            backdropColor: Colors.white,
            borderColor: Colors.white,
          }}>
          <TextInput
            placeholder="Type caption ..."
            onChangeText={text => setcaptionedit(text)}
            placeholderTextColor={Colors.white}
            value={captionedit}
            style={{color: Colors.white}}
          />
        </View>
        {imageurl != '' && (
          <FastImage
            source={{uri: imageurl}}
            style={{
              width: '90%',
              height: 200,
              alignSelf: 'center',
              marginTop: 20,
              opacity: 0.5,
              borderRadius: 10,
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => onClick(captionedit)}
          style={{
            width: '90%',
            height: 50,
            backgroundColor: Colors.black4,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}>
          <Text style={{color: Colors.white, fontSize: 14}}>Update Post</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditCapsion;

const styles = StyleSheet.create({});
