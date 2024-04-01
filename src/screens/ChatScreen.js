import {useIsFocused} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useCallback, useEffect, useState, memo} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import {setChatList} from '../redux/Slice/ChatSlice';
import {NEW_MESSAGE_ALERT} from '../utils/events';
import {getSocket} from '../socket/socket';
import {useSocketEvents} from '../hooks/hooks';
import {setNewMessageAlert} from '../redux/Slice/MessageSlice';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ShowUserList from '../components/ShowUserList';
import CommentOptionmodal from '../components/CommentOptionmodal';
import InputModal from './InputModal';

const ChatScreen = ({navigation}) => {
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
      ['white', Colors.blue],
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

  useEffect(() => {
    fetchData();
    fetchAllUser();
  }, []);

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
          dispatch(setChatList(response.data.chats));
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
  const renderItem = ({item, index}) => {
    const chatCount = count.find(like => like?.chatId == item?._id);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(RoutesName.MessageScreen, {id: item._id})
        }
        style={styles.chatList}>
        <View style={styles.ImgView}>
          <Image source={ImagePath.usericon} style={styles.imageprofile} />
          <View style={{marginLeft: 10}}>
            <Text>{item?.name}</Text>
            <Text>{item?.name}</Text>
          </View>
        </View>
        {chatCount && (
          <View style={styles.countView}>
            {console.log(chatCount == item._id.toString())}
            <Text style={styles.countTx}>{chatCount?.count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
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

  return (
    <View style={{flex: 1}}>
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
            backgroundColor: Colors.booking_slelect_opac,
          },
          scaleStyle,
        ]}
        pointerEvents="none"
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          alignItems: 'flex-end',
          bottom: wp(32),
          right: wp(4),
        }}>
        <AnimatedTouchable
          onPress={() => setopenGropModal(true)}
          style={[
            {
              padding: wp(4),
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: Colors.white,
            },
            opstionStyle1,
          ]}>
          <Image
            source={ImagePath.chaticon}
            style={[{width: 20, height: 20, marginHorizontal: 4}]}
          />
          <Text style={{fontSize: 14, color: Colors.black}}>Create Chat</Text>
        </AnimatedTouchable>

        <AnimatedTouchable
          style={[
            {
              borderRadius: 30,
              marginTop: wp(10),
              backgroundColor: Colors.white,
              flexDirection: 'row',
              padding: wp(4),
            },
            opstionStyle2,
          ]}>
          <Image
            source={ImagePath.peopleicon}
            style={[{width: 20, height: 20, marginHorizontal: 4}]}
          />
          <Text style={{fontSize: 14, color: Colors.black}}>
            Create New Group
          </Text>
        </AnimatedTouchable>
      </View>

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
            width: wp(20),
            height: wp(20),
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
        title={'User Lis'}
        state={openGropModal}
        array={allUsers}
        // onPress={items => createGropAPI(items)}
        onPress={item => {
          setnameModal(true), setSelectedItem(item);
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
  );
};

export default memo(ChatScreen);

const styles = StyleSheet.create({
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
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatList: {
    width: '90%',
    height: hp(10),
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.placeColor,
    margin: 20,
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
