import {useIsFocused} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {
  useCallback,
  useEffect,
  useState,
  memo,
  useRef,
  createRef,
} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import {setChatList} from '../redux/Slice/ChatSlice';
import {NEW_MESSAGE_ALERT} from '../utils/events';
import {getSocket} from '../socket/socket';
import {useSocketEvents} from '../hooks/hooks';
import {setNewMessageAlert} from '../redux/Slice/MessageSlice';
import ShowUserList from '../components/ShowUserList';
import CommentOptionmodal from '../components/CommentOptionmodal';
import InputModal from '../components/InputModal';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  PanGestureHandler,
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';

const ChatScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const chatData = useSelector(state => state.chat.data);
  const count = useSelector(state => state?.message?.NewMessageAlert);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const socket = getSocket();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const token = useSelector(state => state.auth.token);
  const animatedPlus = useSharedValue('-45deg');
  const [loading, setloading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openGropModal, setopenGropModal] = useState(false);
  const [nameModal, setnameModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [groupname, setgroupname] = useState('');

  const optionvalue1 = useSharedValue(wp(80));
  const optionvalue2 = useSharedValue(wp(80));
  const optionvalue3 = useSharedValue(wp(80));

  const scaleValue = useSharedValue(0);
  const btnanivalue = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      fetchData();
      fetchAllUser();
    }
  }, [isFocused]);

  opstionStyle1 = useAnimatedStyle(() => {
    return {
      transform: [{translateX: optionvalue1.value}],
    };
  });
  opstionStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{translateX: optionvalue2.value}],
    };
  });
  opstionStyle3 = useAnimatedStyle(() => {
    return {
      transform: [{translateX: optionvalue3.value}],
    };
  });

  const animatedplusStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: animatedPlus.value}],
    };
  });
  const btnanivalueStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      btnanivalue.value,
      [1, 0],
      ['white', Colors.white],
    );
    return {
      backgroundColor,
    };
  });
  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleValue.value}],
    };
  });

  const newMessageAlertHandler = useCallback(data => {
    console.log(data);
    if (data?.sender != auth?.data?.data?._id) {
      dispatch(setNewMessageAlert(data));
    }
    console.log(data?.sender, '===sender===');
    console.log(auth?.data?.data?._id, '=======user idd====');
  }, []);
  const eventArray = {[NEW_MESSAGE_ALERT]: newMessageAlertHandler};
  useSocketEvents(socket, eventArray);
  const fetchData = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USERS_CHATLIST + '/' + auth?.data?.data?._id)
      .then(response => {
        if (response.data.status) {
          dispatch(setChatList(response.data.chats.reverse()));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchAllUser = () => {
    setloading(true);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include token in headers
    };
    try {
      axios
        .get(BASE_URL + API_URLS.GET_ALL_USERS, {headers: headers})
        .then(response => {
          setloading(false);
          console.log(response.data, '==response get all users====='),
            setloading(false);
          setAllUsers(response.data.data);
        })
        .catch(error => {
          setloading(false);
          console.log(error, '==error get all users===='), setloading(false);
        });
    } catch (e) {
      setloading(false);

      console.log(e, '===error ===');
    }
  };
  const createGropAPI = () => {
    setopenGropModal(false);
    console.log(selectedItem);
    const memberts = selectedItem?.map(item => item?._id);
    console.log(memberts);

    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        name: groupname,
        participants: memberts,
        admin: auth?.data?.data._id,
      };
      axios
        .post(BASE_URL + API_URLS.CREATE_GROUP, body, myHeader)
        .then(response => {
          setloading(false);
          setgroupname('');
          fetchData();
          console.log(response.data, '==response add====='), setloading(false);
        })
        .catch(error => {
          setloading(false);
          console.log(error, '=====error add==='), setloading(false);
        });
    } catch (e) {
      setloading(false);

      console.log(e, '===error ===');
    }
  };

  const swipeableRefs = useRef([]);

  useEffect(() => {
    initializeSwipeableRefs(chatData.length);
  }, []);

  const initializeSwipeableRefs = length => {
    swipeableRefs.current = Array.from({length}, () => createRef());
  };

  const handleCloseSwipeable = index => {
    const swipeableRef = swipeableRefs.current[index]?.current;
    if (swipeableRef) {
      swipeableRef.close(); // Close the swipeable drawer for specific item
    } else {
      console.error(`Swipeable ref at index ${index} is null.`);
    }
  };

  function DeleteChatApi(id, index) {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        userId: auth.data.data._id,
      };
      console.log(BASE_URL + API_URLS.DETELET_GROUP + '/' + id, body, myHeader);
      axios
        .delete(BASE_URL + API_URLS.DETELET_GROUP + '/' + id, body, myHeader)
        .then(response => {
          setloading(false);
          fetchData();
          console.log(response.data, '==response delete====='),
            setloading(false);
          handleCloseSwipeable(index);
        })
        .catch(error => {
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
          console.log(error.response?.data?.error, '=====error delete==='),
            setloading(false);
        });
    } catch (e) {
      setloading(false);

      console.log(e, '===error ===');
    }
  }
  const edit_gropname = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        groupId: id,
        userId: auth.data.data._id,
        newName: '',
      };
      axios
        .delete(BASE_URL + API_URLS.RENAME_GROUP, body, myHeader)
        .then(response => {
          setloading(false);
          fetchData();
          console.log(response.data, '==response delete====='),
            setloading(false);
          handleCloseSwipeable(index);
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
  const renderItem = ({item, index}) => {
    const chatCount = count.find(like => like?.chatId == item?._id);

    const leftSwip = () => {
      return (
        <View
          style={{
            flexDirection: 'row',
            margin: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              DeleteChatApi(item._id, index);
            }}
            style={{
              justifyContent: 'center',
              borderRadius: 10,
              padding: 10,
              height: hp(8),
            }}>
            <Image
              source={ImagePath.deleteicon}
              style={{width: 25, height: 25, tintColor: Colors.white}}
            />
          </TouchableOpacity>
        </View>
      );
    };
    console.log(item.participants[0].profilePic, '==chat item');
    const imagehere = item.participants[0].profilePic;
    return (
      <Swipeable
        ref={swipeableRefs.current[index]}
        renderRightActions={leftSwip}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate(RoutesName.MessageScreen, {id: item._id})
          }
          style={styles.chatList}>
          <View style={styles.ImgView}>
            <Image
              source={imagehere != '' ? {uri: imagehere} : ImagePath.slimuser}
              style={[
                styles.imageprofile,
                {tintColor: imagehere ? null : Colors.white},
              ]}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{color: Colors.white}}>{item?.name}</Text>
              {item?.lastMessage?.content && (
                <Text style={{color: Colors.placeColor}}>
                  {item?.lastMessage?.content}
                </Text>
              )}
            </View>
          </View>
          {chatCount && (
            <View style={styles.countView}>
              {console.log(chatCount == item._id.toString())}
              <Text style={styles.countTx}>{chatCount?.count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.black}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: Colors.black2,
          }}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Image
              source={ImagePath.back}
              style={{
                tintColor: Colors.white,
                width: wp(6),
                height: wp(6),
                padding: 10,
              }}
            />
          </TouchableOpacity>

          <Text style={{color: Colors.white, fontSize: wp(5), margin: 10}}>
            Message
          </Text>
        </View>

        <FlatList
          data={chatData}
          renderItem={(item, index) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
        />

        <Animated.View
          style={[
            {
              width: wp(250),
              height: wp(250),
              borderRadius: wp(125),
              position: 'absolute',
              right: wp(-150),
              bottom: wp(-150),
              backgroundColor: Colors.offwhite,
            },
            scaleStyle,
          ]}
          pointerEvents="none"
        />

        <Animated.View
          style={[
            {
              position: 'absolute',
              alignItems: 'flex-end',
              bottom: wp(32),
              right: wp(4),
            },
            opstionStyle1,
          ]}>
          <TouchableOpacity
            onPress={() => {
              btnanivalue.value = withTiming(0, {duration: 300});
              animatedPlus.value = withTiming('-45deg', {duration: 300});
              scaleValue.value = withTiming(0, {duration: 500});
              optionvalue1.value = withTiming(wp(80), {duration: 300});
              optionvalue2.value = withTiming(wp(80), {duration: 300});
              optionvalue3.value = withTiming(wp(80), {duration: 300});
              navigation.navigate(RoutesName.ListWithoutChat);
            }}
            style={[
              {
                padding: wp(4),
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                backgroundColor: Colors.white,
              },
            ]}>
            <Image
              source={ImagePath.chaticon}
              style={[{width: 20, height: 20, marginHorizontal: 4}]}
            />
            <Text style={{fontSize: 14, color: Colors.black}}>Create Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              btnanivalue.value = withTiming(0, {duration: 300});
              animatedPlus.value = withTiming('-45deg', {duration: 300});
              scaleValue.value = withTiming(0, {duration: 500});
              optionvalue1.value = withTiming(wp(80), {duration: 300});
              optionvalue2.value = withTiming(wp(80), {duration: 300});
              optionvalue3.value = withTiming(wp(80), {duration: 300});
              setopenGropModal(true);
            }}
            style={[
              {
                borderRadius: 30,
                marginTop: wp(10),
                backgroundColor: Colors.white,
                flexDirection: 'row',
                padding: wp(4),
              },
            ]}>
            <Image
              source={ImagePath.peopleicon}
              style={[{width: 20, height: 20, marginHorizontal: 4}]}
            />
            <Text style={{fontSize: 14, color: Colors.black}}>
              Create New Group
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <AnimatedTouchable
          onPress={() => {
            if (animatedPlus.value == '-45deg') {
              animatedPlus.value = withTiming('0deg', {duration: 300});
              btnanivalue.value = withTiming(1, {duration: 300});
              scaleValue.value = withTiming(1, {duration: 500});

              optionvalue1.value = withTiming(0, {duration: 800});
              optionvalue2.value = withTiming(0, {duration: 800});
              optionvalue3.value = withTiming(0, {duration: 800});
            } else {
              btnanivalue.value = withTiming(0, {duration: 300});
              animatedPlus.value = withTiming('-45deg', {duration: 300});
              scaleValue.value = withTiming(0, {duration: 500});
              optionvalue1.value = withTiming(wp(80), {duration: 300});
              optionvalue2.value = withTiming(wp(80), {duration: 300});
              optionvalue3.value = withTiming(wp(80), {duration: 300});
            }
          }}
          style={[
            {
              width: wp(15),
              height: wp(15),
              borderRadius: wp(10),
              backgroundColor: Colors.sky,
              position: 'absolute',
              bottom: wp(6),
              right: wp(4),
              justifyContent: 'center',
              alignItems: 'center',
            },
            btnanivalueStyle,
          ]}>
          <Animated.Image
            source={ImagePath.closeicon}
            style={[{width: 24, height: 24}, animatedplusStyle]}
          />
        </AnimatedTouchable>

        <ShowUserList
          title={'User list for create group'}
          state={openGropModal}
          array={allUsers}
          onPress={item => {
            {
              setnameModal(true), setSelectedItem(item);
            }
          }}
          onPressCancel={() => setopenGropModal(false)}
          selectedItems={[]}
        />
        <InputModal
          cancelpress={() => setnameModal(false)}
          placeholder={'Enter Group Name'}
          savedata={() => {
            setnameModal(false), createGropAPI();
          }}
          status={nameModal}
          titel={'Create New Group'}
          setnewcomment={setgroupname}
          value={groupname}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default memo(ChatScreen);

const styles = StyleSheet.create({
  renderItemContainer: {
    marginVertical: 10,
  },
  listCard: {
    backgroundColor: '#F8F7F1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listCardTextOne: {
    color: '#000000',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  hiddenItemContainer: {
    width: '90%',
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  hiddenItemButton: {
    marginRight: 10,
    backgroundColor: '#191919',
    borderRadius: 4,
    padding: 10,
    margin: 20,
  },
  hiddenItemText: {
    color: '#FFFFFF',
    height: 20,
  },
  countTx: {color: Colors.white, fontSize: 12},
  ImgView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatList: {
    width: '100%',
    height: hp(10),
    // borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: Colors.white,
    // margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  imageprofile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
/*
1) rename group
2) delete gorup



3) add members
4) remove members
6) leave group

=> swip close remaing
*/
