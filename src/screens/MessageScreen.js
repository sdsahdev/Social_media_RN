import {useIsFocused, useRoute} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image} from 'react-native-animatable';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL} from '../utils/Strings';
import {setMessage} from '../redux/Slice/MessageSlice';
const MessageScreen = () => {
  const rotes = useRoute();
  const msgid = rotes.params.id;
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const bottom = useRef();
  const messageData = useSelector(state => state.message.data);
  useEffect(() => {
    fetchData();
    console.log('===');
  }, []);

  const fetchData = () => {
    axios
      .get(`${BASE_URL}${API_URLS.GET_CHAT_MESSAGE}/${msgid}?page=1`)
      .then(response => {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data, '====list==');
          dispatch(setMessage(response.data.message));
          bottom?.current.scrollToIndex({animated: true, index: 0});
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const UserMsg = React.memo(({toggle, data, photo}) => {
    console.log(data, '===data====');
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
      <View style={styles.container}>
        <View style={chatContainerStyle}>
          <Text style={textStyle}>{data.content}</Text>
        </View>
        <Text style={textStylesdate}>{data.createdAt}</Text>
      </View>
    );
  });

  return (
    <View style={{flex: 1}}>
      {console.log(messageData, 'message data=====')}
      <FlatList
        ref={bottom}
        data={messageData}
        showsVerticalScrollIndicator={false}
        key={data => data._id}
        contentContainerStyle={{width: '100%', flexGrow: 1, padding: 10}}
        renderItem={data => {
          return (
            <UserMsg
              key={data.index}
              data={data.item}
              toggle={data.item.sender._id == auth?.data?.data?._id}
            />
          );
        }}
      />

      <View style={styles.bottomview}>
        <TextInput
          style={styles.input}
          placeholder="Type comment here..."
          value={comment}
          onChangeText={txt => setComment(txt)}
        />
        <TouchableOpacity
          onPress={() => console.log('==')}
          disabled={comment == '' ? true : false}
          style={[
            styles.postbtn,
            {
              backgroundColor:
                comment == '' ? Colors.light_theme2 : Colors.dark_theme3,
            },
          ]}>
          <Text style={styles.btntxt}> comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
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
    backgroundColor: Colors.blue,
    padding: hp(2),
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
