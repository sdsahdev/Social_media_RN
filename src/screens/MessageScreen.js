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
import ChatDetails from './ChatDetails';

const MessageScreen = ({navigation}) => {
  const rotes = useRoute();
  const msgid = rotes.params.id;
  const socket = getSocket();
  const auth = useSelector(state => state.auth);
  const messageData = useSelector(state => state.message.data);
  const dispatch = useDispatch();
  const bottom = useRef();
  const endReached = useRef(false);
  const [messgae, setmessgae] = useState('');
  const [chats, setchats] = useState([]);
  const [chatDeatils, setchatDeatils] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalpage] = useState(1);

  const [Iamtyping, setIamtyping] = useState(false);
  const [userTyping, setuserTyping] = useState(false);
  console.log(userTyping, '====usetypinfg');
  const typingTimeout = useRef(null);
  const [loading, setloading] = useState(false);
  const count = useSelector(state => state?.message?.NewMessageAlert);
  let temcurrent = page;

  useEffect(() => {
    dispatch(removeNewMessage(msgid));
    hasAndroidPermission();
    getmssageDetails();
  }, []);
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
    console.log(count, '===========***count***');
    console.log(auth?.data?.data?._id, '===========***user idd===='); // if(msgid == )
    const chatCount = count.find(like => like?.chatId == msgid);
    console.log(chatCount?.chatId, '/////////////', msgid);
    if (chatCount?.chatId == msgid) {
      console.log('id');
      dispatch(removeNewMessage(msgid));
    } else {
      console.log('else');
    }
  }, [count]);

  const newMessages = useCallback(data => {
    console.log(data, '===data==', auth.data.data._id);
    if (data.chatId == msgid) {
      setchats(prew => [data.message, ...prew].flat());
      bottom.current.scrollToIndex({animated: false, index: 0});
    }
  }, []);

  const startTypingLister = useCallback(data => {
    console.log(data);
    if (data.msgid !== msgid) return;
    console.log('start typing...', data);
    setuserTyping(true);
  }, []);

  const aletrLister = useCallback(
    content => {
      const messageForRealTime = {
        content,
        _id: uuid(),
        sender: {
          _id: '65fae427a4727a552fc12000',
          username: 'Admin',
        },
        chat: msgid,
        createdAt: new Date().toISOString(),
      };
      setchats(prew => [...prew, messageForRealTime]);
    },
    [msgid],
  );
  const stopTypingLister = useCallback(data => {
    if (data.msgid !== msgid) return;
    console.log('stop typing...', data);
    setuserTyping(false);
  }, []);

  const eventArray = {
    [NEW_MESSAGE]: newMessages,
    [START_TYPEING]: startTypingLister,
    [STOP_TYPEING]: stopTypingLister,
  };

  useSocketEvents(socket, eventArray);

  const getmssageDetails = () => {
    console.log(msgid, '=getmssageDetails==');
    axios
      .get(`${BASE_URL}${API_URLS.GET_CHAT_DETAILS}/${msgid}`)
      .then(response => {
        // console.log(response.data.success, '=====chat====');
        if (response.data.success) {
          setchatDeatils(response?.data?.chat);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => console.log('finnallty'));
  };
  const fetchData = () => {
    setloading(true);
    console.log(
      `${BASE_URL}${API_URLS.GET_CHAT_MESSAGE}/${msgid}?page=${page}`,
    );
    axios
      .get(`${BASE_URL}${API_URLS.GET_CHAT_MESSAGE}/${msgid}?page=${page}`)
      .then(response => {
        console.log(response.data.status, '///////////////////////');
        if (response.data.status) {
          setchats(prew => [...prew, response.data.message.reverse()].flat());
          setPage(page + 1);
          setTotalpage(response?.data?.totalPages);
          // bottom.current.scrollToIndex({animated: false, index: 0});
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setloading(false);
      });
  };

  const sendMessage = () => {
    if (!messgae.trim()) return;
    const chatId = chatDeatils?._id;
    const participants = chatDeatils?.participants;
    const message = messgae;
    socket.emit(NEW_MESSAGE, {chatId, participants, message});
    setmessgae('');
  };

  const UserMsg = React.memo(({toggle, data, photo}) => {
    const chatContainerStyle = toggle
      ? styles.chatcontanertrue
      : styles.chatcontanerflase;
    const textStyle = [
      {
        flex: 1,
        flexWrap: 'wrap',
        color: toggle ? Colors.white : Colors.blue,
        textAlign: toggle ? 'right' : 'left',
        alignSelf: 'flex-start',
      },
    ];
    const textStylesdate = [
      {
        textAlign: toggle ? 'right' : 'left',
        color: Colors.black,
      },
    ];

    return (
      <View style={{paddingHorizontal: 2, flexDirection: 'column'}}>
        {data?.attachments?.length != 0 &&
          data?.attachments?.map(data => {
            return (
              <Image
                source={{uri: data?.url}}
                style={{
                  width: '70%',
                  height: hp(25),
                  resizeMode: 'contain',
                  backgroundColor: '#000',
                  alignSelf: toggle ? 'flex-end' : 'flex-start',
                  margin: 10,
                  borderRadius: 10,
                }}
              />
            );
          })}
        {data?.content?.trim() && (
          <>
            <View style={chatContainerStyle}>
              <Text style={textStyle}>{data?.content}</Text>
            </View>
            <Text style={textStylesdate}>{data?.createdAt}</Text>
          </>
        )}
      </View>
    );
  });
  const participants = chatDeatils?.participants;

  const onchangemsg = data => {
    setmessgae(data);
    if (!Iamtyping) {
      socket.emit(START_TYPEING, {participants, msgid});
      setIamtyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      setIamtyping(false);
      socket.emit(STOP_TYPEING, {participants, msgid});
    }, 2000);
  };
  return (
    <View style={{flex: 1}} behavior="padding">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(RoutesName.ChatDetails, {data: chatDeatils});
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          borderBottomWidth: 2,
        }}>
        <Text style={{fontSize: 20}}>{chatDeatils?.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={ImagePath.callicon} style={{width: 24, height: 24}} />
      </TouchableOpacity>
      <FlatList
        ref={bottom}
        data={chats}
        showsVerticalScrollIndicator={false}
        key={data => data._id}
        contentContainerStyle={{width: '100%', flexGrow: 1}}
        inverted
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => {
          {
            return loading ? (
              <View style={[]}>
                <ActivityIndicator size="large" color={Colors.black} />
              </View>
            ) : null;
          }
        }}
        onEndReached={() => {
          console.log(endReached.current);
          console.log(totalPage, '++++++++++++++', page);
          if (totalPage < page) {
            console.log(
              'data is no more  totalPage =>  ',
              totalPage,
              ' current page => ' + page,
            );
          } else {
            if (temcurrent == page) {
              temcurrent = page + 1;

              console.log('*** page incress *******' + Number(page + 1));

              fetchData();
            } else {
              console.log('****************bugs***************');
            }
          }
        }}
        renderItem={data => {
          return (
            <UserMsg
              key={data?.index}
              data={data?.item}
              toggle={data?.item?.sender?._id == auth?.data?.data?._id}
            />
          );
        }}
      />
      {userTyping && <Text style={styles.typeTx}>Typeing ...</Text>}
      <View style={styles.bottomview}>
        <TextInput
          style={styles.input}
          placeholder="Type messgae here ..."
          value={messgae}
          onChangeText={txt => onchangemsg(txt)}
        />

        <TouchableOpacity
          style={{backgroundColor: 'red', padding: 4}}
          onPress={() =>
            navigation.navigate(RoutesName.GallaryScreen, {id: msgid})
          }>
          <Image
            source={ImagePath.gallaryicon}
            style={{width: 24, height: 24}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => sendMessage()}
          disabled={messgae == '' ? true : false}
          style={[
            styles.postbtn,
            {
              backgroundColor: messgae == '' ? Colors.blue : Colors.dark_theme3,
            },
          ]}>
          <Text style={styles.btntxt}> send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  typeTx: {
    fontSize: 18,
    color: Colors.black,
  },
  postbtn: {
    width: '20%',
    backgroundColor: Colors.dark_theme2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  btntxt: {
    color: Colors.white,
  },
  input: {
    width: '70%',
    height: '100%',
  },
  bottomview: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    padding: hp(2),
    borderColor: Colors.blue,
    borderWidth: 2,
    borderRadius: 10,
  },
  chatcontanertrue: {
    flex: 1,
    flexWrap: 'wrap',
    alignSelf: 'baseline',
    borderColor: Colors.dark_theme3,
    borderWidth: 2,
    padding: 10,
    borderRadius: 30,
    maxWidth: '85%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
    backgroundColor: Colors.blue,
  },
  chatcontanerflase: {
    flex: 1,
    flexWrap: 'wrap',
    alignSelf: 'baseline',
    borderColor: Colors.dark_theme3,
    borderWidth: 2,
    padding: 10,
    borderRadius: 30,
    maxWidth: '85%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 30,
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
  },
  rightArrow: {
    position: 'absolute',
    backgroundColor: '#0078fe',
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: 'absolute',
    backgroundColor: Colors.white,
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#dedede',
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#eeeeee',
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
});
