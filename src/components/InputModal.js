import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

import {Colors} from '../utils/Colors';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const InputModal = ({
  status,
  titel,
  value,
  placeholder,
  setnewcomment,
  cancelpress,
  savedata,
}) => {
  return (
    <Modal transparent visible={status}>
      <View style={styles.modalView}>
        <View style={styles.mainView}>
          <Text style={styles.editTx}>{titel}</Text>

          <TextInput
            value={value}
            onChangeText={setnewcomment}
            style={styles.commentinput}
            placeholder={placeholder}
          />
          <View style={styles.bottomview}>
            <TouchableOpacity
              onPress={() => cancelpress()}
              style={styles.cancelbtn}>
              <Text style={styles.btntxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                savedata();
              }}
              style={[styles.cancelbtn, {backgroundColor: Colors.black3}]}>
              <Text style={styles.btntxt}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InputModal;
const styles = StyleSheet.create({
  cancelbtn: {
    width: '40%',
    height: 45,
    backgroundColor: Colors.placeColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomview: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  commentinput: {
    width: '90%',
    height: heightPercentageToDP(7),
    paddingLeft: 20,
    borderWidth: 2,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    color: Colors.black,
  },
  editTx: {
    fontSize: 16,
    color: Colors.black,
    alignSelf: 'center',
    marginTop: 20,
  },
  mainView: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingBottom: 20,
  },
  modalView: {
    flex: 1,
    backgroundColor: Colors.modalbg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  bottomView: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.background,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    lignItems: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    width: '70%',
    height: '100%',
  },
  postbtn: {
    width: '20%',
    height: '60%',
    backgroundColor: Colors.black3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: Colors.white,
  },
});
