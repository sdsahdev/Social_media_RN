import storage from '@react-native-firebase/storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { Colors } from '../utils/Colors';
import { API_URLS, BASE_URL, ImagePath } from '../utils/Strings';

const EditProfile = () => {
  const rotes = useRoute();
  const [imageData, setImagedata] = useState('');
  const [imageuri, setimageuri] = useState('');
  const [isCoverEditable, setisCoverEditable] = useState(false);
  const [isProfileEditable, setisProfileEditable] = useState(false);
  const auth = useSelector(state => state.auth);
  const [loading, setloading] = useState(false);

  const openGallaryf = async () => {
    try {
      const res = await ImagePicker.launchImageLibrary({mediaType: 'photo'});
      console.log('====================================');
      console.log(res?.assets[0]?.uri);
      console.log('====================================');
      if (!res.didCancel) {
        setimageuri(res?.assets[0]?.uri);
        setImagedata(res);
        setisCoverEditable(true);
      } else {
        console.log('cancel gallaey');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadImageToFirebase = async () => {
    setloading(true);
    let url = '';
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    if (imageData) {
      try {
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        // uploads file
        await reference.putFile(pathToFile);

        url = await storage()
          .ref(imageData.assets[0].fileName)
          .getDownloadURL();
        console.log(url, '==firebase function');
        if (isProfileEditable) {
          updateProfilePic(url);
        } else {
          updateCoverPic(url);
        }
      } catch (e) {
        console.log(e);
        setloading(false);
      }
    }
  };

  const updateProfilePic = url => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const body = {
      profilePic: url,
    };
    console.log(auth.data.data._id);
    try {
      axios
        .put(
          BASE_URL + API_URLS.UPDATE_URERS + '/' + auth.data.data._id,
          body,
          myHeaders,
        )
        .then(response => {
          response.data, setloading(false);
        })
        .catch(error => {
          console.error(error), setloading(false);
        });
    } catch (e) {
      console.log(e);
      setloading(false);
    }
  };

  const updateCoverPic = url => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
 
    const body = {
      coverPic: url,
    };
    try {
      console.log(auth.data.data._id, 'user_is' , body);
      console.log( BASE_URL + API_URLS.UPDATE_URERS + '/' + auth.data.data._id, "===url==");
      axios
        .put(
          BASE_URL + API_URLS.UPDATE_URERS + '/' + auth.data.data._id,
          body,
        )
        .then(response => {response.data,setloading(false);})
        .catch(error => {console.error(error),setloading(false);});
    } catch (e) {
      console.log(e);
      setloading(false);
    }
  };
  return (
    <View style={styles.conatner}>
      {console.log(rotes.params.data, '==data===')}
      <Loader visible={loading} />
      <TouchableOpacity onPress={() => openGallaryf()} style={styles.coverbtn}>
        {imageData != '' ? (
          <Image source={{uri: imageuri}} style={styles.coverimage} />
        ) : (
          <>
            <Image source={ImagePath.homeicon} style={styles.image} />
            <Image source={ImagePath.editicon} style={styles.editimage} />
          </>
        )}
      </TouchableOpacity>

      {isCoverEditable ? (
        <TouchableOpacity
          onPress={() => uploadImageToFirebase()}
          style={styles.uploadbt}>
          <Text style={{color: Colors.white}}>Upload</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  uploadbt: {
    width: 120,
    height: 50,
    backgroundColor: Colors.dark_theme3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  coverimage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  conatner: {flex: 1},
  coverbtn: {
    width: '90%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.dark_theme3,
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    tintColor: Colors.white,
  },
  editimage: {
    width: 20,
    height: 20,
    tintColor: Colors.white,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
