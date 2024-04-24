import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import Modal from 'react-native-modal';
import {Colors} from '../utils/Colors';
import {ImagePath} from '../utils/Strings';

const CommentOptionmodal = ({onClick, onClose, visible}) => {
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
          width: '90%',
          height: 150,
          backgroundColor: Colors.black5,
          bottom: 0,
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            color: Colors.white,
            fontSize: 16,
            marginTop: 20,
            marginLeft: 20,
          }}>
          Comment Options
        </Text>

        <TouchableOpacity
          onPress={() => {
            onClick(1);
          }}
          style={{
            flexDirection: 'row',
            width: '90%',
            height: 50,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Image
            source={ImagePath.editicon}
            style={{width: 20, height: 20, tintColor: Colors.white}}
          />
          <Text style={{color: Colors.white, fontSize: 16, marginLeft: 20}}>
            Edit Comment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onClick(2);
          }}
          style={{
            flexDirection: 'row',
            width: '90%',
            height: 50,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Image
            source={ImagePath.deleteicon}
            style={{width: 20, height: 20, tintColor: Colors.white}}
          />
          <Text style={{color: Colors.white, fontSize: 16, marginLeft: 20}}>
            Delete Comment
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CommentOptionmodal;

const styles = StyleSheet.create({});
