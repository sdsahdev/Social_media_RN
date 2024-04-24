import storage from '@react-native-firebase/storage';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import CustomTextInput from '../components/CustomTextInput';
import Loader from '../components/Loader';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath} from '../utils/Strings';

const EditProfile = ({navigation}) => {
  const rotes = useRoute();
  const data = rotes.params.data;
  const [imageData, setImagedata] = useState('');
  const [imageuri, setimageuri] = useState(
    data?.coverPic == '' ? '' : data?.coverPic,
  );
  const [profileimgdata, setprofileimgdata] = useState('');
  const [profileUri, setprofileUri] = useState(
    data?.profilePic == '' ? '' : data?.profilePic,
  );
  const [isCoverEditable, setisCoverEditable] = useState(false);
  const [isProfileEditable, setisProfileEditable] = useState(false);
  const auth = useSelector(state => state.auth);
  const [loading, setloading] = useState(false);

  // edit
  const [username, setUsername] = useState(
    data?.username == '' ? '' : data?.username,
  );
  const [badUsername, setBadUsername] = useState('');
  const [mobile, setMobile] = useState(data?.mobile == '' ? '' : data?.mobile);
  const [badMobile, setBadMobile] = useState('');
  const [bio, setbio] = useState(data?.bio == '' ? '' : data?.bio);
  // const [badbio, setbadbio] = useState('');
  const [address, setaddress] = useState(
    data?.address == '' ? '' : data?.address,
  );
  // const [badaddress, setbadaddress] = useState('');
  const [password, setPassword] = useState('');
  const [badPassword, setBadPassword] = useState('');

  const openGallaryf = async type => {
    try {
      const res = await ImagePicker.launchImageLibrary({mediaType: 'photo'});
      console.log('====================================');
      console.log(res?.assets[0]?.uri);
      console.log('====================================');
      if (!res.didCancel) {
        if (type == 'cover') {
          setimageuri(res?.assets[0]?.uri);
          setImagedata(res);
          setisCoverEditable(true);
          setisProfileEditable(false);
        } else {
          setprofileUri(res?.assets[0]?.uri);
          setprofileimgdata(res);
          setisCoverEditable(false);
          setisProfileEditable(true);
        }
      } else {
        console.log('cancel gallaey');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const validate = () => {
    let isValided = false;

    // phone number
    if (mobile == '') {
      isValided = false;
      setBadMobile('Please Enter Mobile Number');
    } else if (mobile.length != 10) {
      setBadMobile('Please Enter Valided Mobile Number');
      isValided = false;
    } else {
      isValided = true;
      setBadMobile('');
    }

    // UserName
    if (username == '') {
      isValided = false;
      setBadUsername('Please Enter Username');
    } else {
      isValided = true;
      setBadUsername('');
    }

    return isValided;
  };
  const updateotherdetails = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const body = {
      username: username,
      mobile: mobile,
      bio: bio,
      address: address,
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
          setImagedata(null);
          setprofileimgdata(null);
          setisProfileEditable(false);
          setisCoverEditable(false);
          navigation.pop();
        })
        .catch(error => {
          console.error(error), setloading(false);
        });
    } catch (e) {
      console.log(e);
      setloading(false);
    }
  };

  const uploadImageToFirebase = async dataodimg => {
    setloading(true);
    let url = '';
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    try {
      const reference = storage().ref(dataodimg.assets[0].fileName);
      const pathToFile = dataodimg.assets[0].uri;
      // uploads file
      await reference.putFile(pathToFile);

      url = await storage().ref(dataodimg.assets[0].fileName).getDownloadURL();
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
          setImagedata(null);
          setprofileimgdata(null);
          setisProfileEditable(false);
          setisCoverEditable(false);
          navigation.pop();
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
      console.log(auth.data.data._id, 'user_is', body);
      console.log(
        BASE_URL + API_URLS.UPDATE_URERS + '/' + auth.data.data._id,
        '===url==',
      );
      axios
        .put(BASE_URL + API_URLS.UPDATE_URERS + '/' + auth.data.data._id, body)
        .then(response => {
          response.data;
          setloading(false);
          setImagedata(null);
          setisProfileEditable(false);
          setisCoverEditable(false);
          navigation.pop();
        })
        .catch(error => {
          console.error(error), setloading(false);
        });
    } catch (e) {
      console.log(e);
      setloading(false);
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.conatner}>
      {console.log(data, '==data===')}
      <Loader visible={loading} />
      <Text style={styles.heading}>Chnage Cover Pic</Text>
      <TouchableOpacity
        onPress={() => openGallaryf('cover')}
        style={styles.coverbtn}>
        {imageuri != '' ? (
          <Image source={{uri: imageuri}} style={styles.coverimage} />
        ) : (
          <>
            <Image source={ImagePath.homeicon} style={styles.image} />
          </>
        )}
        <Image source={ImagePath.editicon} style={styles.editimage} />
      </TouchableOpacity>

      {isCoverEditable ? (
        <TouchableOpacity
          onPress={() => uploadImageToFirebase(imageData)}
          style={styles.uploadbt}>
          <Text style={{color: Colors.white}}>Upload</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.heading}>Chnage Profile Pic</Text>
      <TouchableOpacity
        onPress={() => openGallaryf('profile')}
        style={styles.profilepic}>
        {profileUri != '' ? (
          <Image
            source={{uri: profileUri}}
            style={[styles.profilepic, styles.profilebtn]}
          />
        ) : (
          <Image source={ImagePath.usericon} style={styles.image} />
        )}
        <Image source={ImagePath.editicon} style={styles.editimage} />
      </TouchableOpacity>

      {isProfileEditable ? (
        <TouchableOpacity
          onPress={() => uploadImageToFirebase(profileimgdata)}
          style={styles.uploadbt}>
          <Text style={{color: Colors.white}}>Upload</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.heading}>Edit Details</Text>
      <View
        style={{
          width: '90%',
          marginTop: 20,
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <CustomTextInput
          customTxtStyle={{color: Colors.white}}
          icon={ImagePath.usericon}
          placeholder={'Enter Username'}
          value={username}
          onChangeText={txt => setUsername(txt)}
          isValide={badUsername == '' ? true : false}
          errorMessage={badUsername}
        />
        <CustomTextInput
          icon={ImagePath.callicon}
          customTxtStyle={{color: Colors.white}}
          placeholder={'Enter Mobile Number'}
          value={mobile}
          onChangeText={txt => setMobile(txt)}
          isValide={badMobile == '' ? true : false}
          errorMessage={badMobile}
          keyboardType={'number-pad'}
        />
        <CustomTextInput
          customTxtStyle={{color: Colors.white}}
          icon={ImagePath.editicon}
          placeholder={'Enter Bio'}
          value={bio}
          onChangeText={txt => setbio(txt)}
          isValide={true}
          // errorMessage={badbio}
        />
        <CustomTextInput
          customTxtStyle={{color: Colors.white}}
          icon={ImagePath.homeicon}
          placeholder={'Enter Address'}
          value={address}
          onChangeText={txt => setaddress(txt)}
          isValide={true}
          // errorMessage={badaddress}
        />
        <TouchableOpacity
          onPress={() => {
            if (validate()) {
              updateotherdetails();
            }
          }}
          style={styles.updatebtn}>
          <Text style={styles.btnsave}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  conatner: {flex: 1, backgroundColor: Colors.black1},
  btnsave: {fontSize: 16, color: Colors.white},
  updatebtn: {
    width: '90%',
    height: 50,
    marginTop: 10,
    backgroundColor: Colors.black4,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 20,
  },
  profilebtn: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    marginLeft: 0,
    marginTop: 0,
  },
  img: {justifyContent: 'center', alignItems: 'center'},
  profilepic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark_theme3,
    marginLeft: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  coverbtn: {
    width: '90%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.black4,
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
