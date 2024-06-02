import {useIsFocused, useRoute} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Image} from 'react-native-animatable';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import FastImage from 'react-native-fast-image';
import CheckBox from '@react-native-community/checkbox';
import {
  RoundedCheckbox,
  PureRoundedCheckbox,
} from 'react-native-rounded-checkbox';
import Loader from '../components/Loader';
import {getSocket} from '../socket/socket';
import {showMessage} from 'react-native-flash-message';
const GallaryScreen = ({navigation}) => {
  useEffect(() => {
    hasAndroidPermission();
    openCameraRoll();
  }, []);

  const socket = getSocket();
  const rotes = useRoute();
  const chatId = rotes.params.id;
  const [gallaryList, setgallaryList] = useState([]);
  const [page, setPage] = useState(1); // Track current page
  const [selectedImg, setselectedImg] = useState([]);
  const [loading, setloading] = useState(false);
  // Track current page
  const pageSize = 20; // Number of images to fetch per page
  const auth = useSelector(state => state.auth.data);
  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }
  useEffect(() => {
    openCameraRoll();
  }, [page]);
  const handleEndReached = () => {
    if (!loading) {
      console.log(page, '==handleEndReached==');
      setPage(page + 1);
    }
  };

  const openCameraRoll = () => {
    console.log(page, '==openCameraRoll==');
    CameraRoll.getPhotos({
      first: pageSize * page,
      assetType: 'Photos',
    })
      .then(res => {
        setgallaryList(res.edges);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const sendImage = () => {
    setloading(true);
    const formData = new FormData();
    selectedImg.forEach((image, index) => {
      const type = image.node.type;
      const uri = image.node.image.uri;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      console.log(type, '===formdata==');
      console.log(uri, '===formdata==');
      console.log(filename, '===formdata==');
      formData.append(`files`, {
        // Change field name to 'files'
        uri: uri,
        type: type,
        name: filename,
      });
    });
    formData.append('sender', auth?.data?._id);
    // formData.append('content', socket.id);
    formData.append('chatId', chatId);
    console.log(formData, '===formdata==');

    axios
      .post(`${BASE_URL}${API_URLS.SEND_PICS}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(resp => {
        navigation.replace(RoutesName.MessageScreen, {id: chatId});
        console.log(resp.data, '===image====');
      })
      .catch(error => {
        showMessage({
          message: 'Try again later. Something went wrong.',
          type: 'danger',
          backgroundColor: Colors.black,
          icon: 'danger',
          color: '#fff',
        });
        console.error('Error uploading images', error);
      })
      .finally(() => {
        setloading(false);
      });
  };
  const selectionHandle = item => {
    const isSelecte = selectedImg.find(
      i => i.node.image.uri == item.node.image.uri,
    );
    if (!isSelecte) {
      if (selectedImg.length <= 4) {
        console.log('false ====== is selected===');
        setselectedImg([...selectedImg, item]);
      } else {
        console.log('you can maximun 5 image select');
      }
    } else {
      console.log('true ====== is selected===');
      const outitem = selectedImg.filter(
        i => i.node.image.uri != item.node.image.uri,
      );
      // console.log(outitem);
      setselectedImg(outitem);
    }
  };
  // const type = item.node.type;
  // const uri = item.node.image.uri;
  // const filename = uri.substring(uri.lastIndexOf('/') + 1);
  // console.log(filename);
  // console.log(type);
  // console.log(uri);
  const renderItem = ({item, index}) => {
    const isSelecte = selectedImg.find(
      i => i.node.image.uri == item.node.image.uri,
    );
    return (
      <TouchableOpacity
        onPress={() => selectionHandle(item)}
        style={{
          width: '30%',
          height: 100,
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '1.5%',
        }}>
        <Image
          source={{uri: item.node.image.uri}}
          defaultSource={ImagePath.gallaryicon}
          // tintColor={isSelecte ? 'green' : 'blue'}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
            opacity: isSelecte ? 0.7 : 1,
          }}
        />
        {isSelecte && (
          <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
            <PureRoundedCheckbox
              outerStyle={{width: 30, height: 30}}
              innerStyle={{width: 24, height: 24}}
              onPress={checked => console.log('Checked: ', checked)}
              text={selectedImg.indexOf(isSelecte) + 1}
              isChecked={true}
              active={false}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
      }}>
      <Loader visible={loading} />
      <FlatList
        data={gallaryList}
        numColumns={3}
        contentContainerStyle={{
          backgroundColor: Colors.black,
          marginVertical: 2,
        }}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached} // Callback when end of list is reached
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => {
          {
            <View style={{margin: 20}}>
              <ActivityIndicator size="large" color={Colors.black} />
            </View>;
          }
        }}
      />
      <TouchableOpacity
        onPress={() => sendImage()}
        style={{
          position: 'absolute',
          width: '90%',
          height: hp(8),
          backgroundColor: Colors.white,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: hp(2),
          borderWidth: 2,
          borderColor: Colors.black,
        }}>
        <Text style={{color: Colors.black, fontSize: 16}}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GallaryScreen;

const styles = StyleSheet.create({});
