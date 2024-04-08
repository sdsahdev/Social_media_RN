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
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {API_URLS, BASE_URL, ImagePath} from '../utils/Strings';
import {Colors} from '../utils/Colors';

const ListWithoutChat = ({navigation}) => {
  const [loading, setloading] = useState(false);
  const auth = useSelector(state => state.auth?.data);
  useEffect(() => {
    fetchAllUser();
  }, []);
  const [allUsers, setAllUsers] = useState([]);
  const fetchAllUser = () => {
    setloading(true);
    const headers = {
      'Content-Type': 'application/json',
      //   Authorization: `Bearer ${token}`, // Include token in headers
    };
    try {
      axios
        .get(BASE_URL + API_URLS.LIST_WITHOUT_CHAT + '/' + auth?.data?._id, {
          headers: headers,
        })
        .then(response => {
          setloading(false);
          console.log(response.data, '==response get all users====='),
            setloading(false);
          setAllUsers(response.data?.usersWithoutPersonalChat);
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

  const createPersonalChat = id => {
    setloading(true);
    const headers = {
      'Content-Type': 'application/json',
      //   Authorization: `Bearer ${token}`, // Include token in headers
    };
    const body = {
      userId: auth?.data?._id,
      participantId: id,
    };
    try {
      axios
        .post(BASE_URL + API_URLS.CRAETE_PERSONAL_CHAT, body, {
          headers: headers,
        })
        .then(response => {
          setloading(false);
          console.log(response.data, '==response get all users====='),
            setloading(false);
          navigation.pop();
          //   setAllUsers(response.data?.usersWithoutPersonalChat);
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
    return (
      <View style={styles.chatList}>
        <View style={styles.ImgView}>
          <Image source={ImagePath.usericon} style={styles.imageprofile} />
          <View style={{marginLeft: 10}}>
            <Text>{item?.username}</Text>
            <Text>{item?.gender}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            createPersonalChat(item?._id);
          }}
          style={styles.chatbtn}>
          <Text>Chat</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={allUsers}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListWithoutChat;

const styles = StyleSheet.create({
  chatbtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  imageprofile: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  ImgView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
