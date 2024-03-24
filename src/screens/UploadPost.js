import React, { useRef, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image, Text } from 'react-native-animatable';
import * as ImagePicker from 'react-native-image-picker';
import { Colors } from '../utils/Colors';
import { ImagePath } from '../utils/Strings';

const UploadPost = () => {
  const ref = useRef();
  const [imageData, setImagedata] = useState(null);
  const [caption, setCaption] = useState('');

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        opeenCameraf();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        openGallaryf();
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const opeenCameraf = async () => {
    try {
      const res = await ImagePicker.launchCamera({mediaType: 'photo'});
      if (!res.didCancel) {
        setImagedata(res);
        console.log(res, '=====');
      } else {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const openGallaryf = async () => {
    try {
      const res = await ImagePicker.launchImageLibrary({mediaType: 'photo'});
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      if (!res.didCancel) {
        setImagedata(res);
      } else {
        console.log('cancel gallaey');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => ref?.current?.focus()}
        activeOpacity={1}
        style={styles.captionBox}>
        <TextInput
          value={caption}
          onChangeText={txt => setCaption(txt)}
          style={styles.input}
          placeholder="Type caption here ..."
          ref={ref}
        />
      </TouchableOpacity>

      {imageData != null ? (
        <View style={styles.ImageView}>
          <Image
            source={{uri: imageData?.assets[0]?.uri}}
            style={styles.imagestyle}
          />
          <TouchableOpacity onPress={() => setImagedata(null)} style={styles.removebtn}>
            <Image
              source={ImagePath.closeicon}
              style={[styles.camera, {width: 20, height: 20}]}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <TouchableOpacity
        onPress={() => requestCameraPermission()}
        style={styles.containBox}>
        <Image source={ImagePath.cameraicon} style={styles.camera} />
        <Text style={styles.pickerTitel}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => requestExternalWritePermission()}
        style={[styles.containBox]}>
        <Image source={ImagePath.gallaryicon} style={styles.camera} />
        <Text style={styles.pickerTitel}>Open Gallary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.postbtn,
          {
            backgroundColor:
              caption == '' && imageData == null
                ? '#f2f2f2'
                : Colors.dark_theme3,
          },
        ]}>
        <Text style={styles.posttxt}>Post Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadPost;

const styles = StyleSheet.create({
  posttxt: {
    fontSize: 18,
    color: Colors.white,
  },
  postbtn: {
    width: '90%',
    height: 50,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  removebtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
  },
  imagestyle: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  ImageView: {
    marginLeft: 15,
    width: '90%',
    marginTop: 20,
    borderRadius: 10,
    height: 200,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  captionBox: {
    width: '90%',
    height: 100,
    borderWidth: 2,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
    borderColor: '#9e9e9e',
  },
  input: {
    width: '100%',
  },
  containBox: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: '#9e9e9e',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 20,
  },
  camera: {
    width: 24,
    height: 24,
    tintColor: '#9e9e9e',
    margin: 5,
  },
  pickerTitel: {
    marginLeft: 15,
    fontSize: 18,
    color: '#000',
  },
});
