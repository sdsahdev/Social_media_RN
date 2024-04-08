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
import {getSocket} from '../socket/socket';
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPEING,
  STOP_TYPEING,
} from '../utils/events';
import {useSocketEvents} from '../hooks/hooks';
import {
  removeNewMessage,
  setNewMessageAlert,
} from '../redux/Slice/MessageSlice';
import {showMessage} from 'react-native-flash-message';

const ChatDetails = () => {
  const rotes = useRoute();
  const data = rotes.params.data;
  const textInputRef = useRef(null);
  const [loading, setloading] = useState(false);
  const auth = useSelector(state => state.auth.data);

  const [chatDeatils, setchatDeatils] = useState(null);
  const [editName, setEditName] = useState('');
  const [isRename, setisRename] = useState(false);
  useEffect(() => {
    getmssageDetails();
  }, []);
  const getmssageDetails = () => {
    axios
      .get(`${BASE_URL}${API_URLS.GET_CHAT_DETAILS}/${data._id}?populate=true`)
      .then(response => {
        console.log(response.data);
        if (response.data.success) {
          setchatDeatils(response?.data?.chat);
          setEditName(chatDeatils?.name);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => console.log('finnallty'));
  };
  const edit_gropname = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        groupId: data._id,
        userId: auth.data._id,
        newName: editName,
      };
      axios
        .post(BASE_URL + API_URLS.RENAME_GROUP, body, myHeader)
        .then(response => {
          setloading(false);
          console.log(response.data, '==response delete====='),
            setloading(false);
        })
        .catch(error => {
          setloading(false);
          console.log(error, '=====error delete==='), setloading(false);
        });
    } catch (e) {
      setloading(false);
      console.log(e, '===error ===');
    }
  };
  const leaveGroup = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        userId: auth.data._id,
      };
      axios
        .post(
          `${BASE_URL}${API_URLS.LEAVE_GROUP}/${chatDeatils._id}`,
          body,
          myHeader,
        )
        .then(response => {
          setloading(false);
          console.log(response.data, '==response delete====='),
            setloading(false);
        })
        .catch(error => {
          setloading(false);
          showMessage({
            message: error?.response?.data?.error
              ? error?.response?.data?.error
              : 'Try again later. Something went wrong.',
            type: 'danger',
            backgroundColor: 'red',
            icon: 'danger',
            color: '#fff',
          });
          setloading(false);
        });
    } catch (e) {
      setloading(false);
      console.log(e, '===error ===');
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: Colors.white,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={ImagePath.usericon} style={styles.imageprofile} />
          <Text style={{fontSize: 15, marginHorizontal: 10}}>
            {item.username}
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 4,
          }}>
          <Text style={{fontSize: 15, marginHorizontal: 10}}>Follow</Text>
        </View> */}
      </View>
    );
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{marginTop: hp(10), alignItems: 'center'}}>
        <Image
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
          source={ImagePath.usericon}
        />
        {isRename == false ? (
          <Text style={{fontSize: 20}}>{chatDeatils?.name}</Text>
        ) : (
          <>
            <TextInput
              ref={textInputRef}
              style={{fontSize: 20, color: Colors.black}}
              placeholder={'Enter Name'}
              value={editName}
              autoFocus={true}
              onChangeText={txt => setEditName(txt)}
            />
            <TouchableOpacity
              onPress={() => edit_gropname()}
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: Colors.black,
                borderRadius: 8,
              }}>
              <Text>Update Name </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          marginTop: hp(5),
        }}>
        <TouchableOpacity
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <Image
            style={{
              width: 25,
              height: 25,
              resizeMode: 'contain',
            }}
            source={ImagePath.adduser}
          />
          <Text style={{fontSize: 12, color: Colors.black, marginTop: hp(2)}}>
            Add
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setisRename(!isRename),
              console.log(textInputRef.current),
              textInputRef.current && textInputRef.current.focus();
          }}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <Image
            style={{
              width: 25,
              height: 25,
              resizeMode: 'contain',
            }}
            source={ImagePath.editicon}
          />
          <Text style={{fontSize: 12, color: Colors.black, marginTop: hp(2)}}>
            Rename
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            leaveGroup();
          }}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <Image
            style={{
              width: 25,
              height: 25,
              resizeMode: 'contain',
            }}
            source={ImagePath.leave}
          />
          <Text style={{fontSize: 12, color: Colors.black, marginTop: hp(2)}}>
            Leave
          </Text>
        </TouchableOpacity>
      </View>
      {console.log(chatDeatils, '==data,')}
      <Text style={{fontSize: 15, color: Colors.black, marginTop: hp(2)}}>
        Members
      </Text>
      <FlatList
        style={{width: '90%', marginTop: 10}}
        data={chatDeatils?.participants}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  imageprofile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
