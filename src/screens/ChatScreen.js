import {useIsFocused} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useEffect, useState} from 'react';
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

const ChatScreen = ({navigation}) => {
  const chatData = useSelector(state => state.chat.data);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USERS_CHATLIST + '/' + auth?.data?.data?._id)
      .then(response => {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data, '====list==');
          dispatch(setChatList(response.data.chats));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderItem = ({item, index}) => {
    console.log(item, '===items');
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

        <View style={styles.countView}>
          <Text style={styles.countTx}>99</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={chatData}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatScreen;

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
