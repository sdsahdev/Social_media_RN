import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image} from 'react-native-animatable';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import CommentOptionmodal from '../components/CommentOptionmodal';
import Loader from '../components/Loader';
import TimeAgo from '../components/TimeAgo';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath} from '../utils/Strings';
import FastImage from 'react-native-fast-image';
const Comment = () => {
  const auth = useSelector(state => state.auth);
  const rotes = useRoute();
  const [comment, setComment] = useState('');
  const [newcomment, setnewcomment] = useState('');
  const [loading, setloading] = useState(false);
  const [commentList, setcommentList] = useState([]);
  const [commentOption, setcommentOption] = useState(false);
  const [seleectedItem, setseleectedItem] = useState(null);
  const [openupdatecommentmodal, setOpenupdatecommentmodal] = useState(false);

  useEffect(() => {
    fetchComent();
  }, []);
  const fetchComent = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      axios
        .get(BASE_URL + API_URLS.GET_COMMENT + '/' + rotes.params.id, myHeader)
        .then(response => {
          setloading(false);
          console.log(response.data, '==response get comment====='),
            setloading(false);
          setcommentList(response.data.data);
        })
        .catch(error => {
          setloading(false);
          console.log(error, '=====error  get comment==='), setloading(false);
        });
    } catch (e) {
      setloading(false);

      console.log(e, '===error ===');
    }
  };
  const postComment = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        comment: comment,
        userId: auth?.data?.data._id,
        username: auth?.data?.data.username,
        postId: rotes.params.id,
      };
      axios
        .post(BASE_URL + API_URLS.ADD_COMMENT, body, myHeader)
        .then(response => {
          setloading(false);
          fetchComent();
          setComment('');
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
  const deleteComment = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      axios
        .delete(
          BASE_URL + API_URLS.DELETE_COMMENT + '/' + seleectedItem._id,
          myHeader,
        )
        .then(response => {
          setloading(false);
          fetchComent();
          setComment('');
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

  const updateComment = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    const body = {
      comment: newcomment,
      userId: auth?.data?.data._id,
      username: auth?.data?.data.username,
      postId: rotes.params.id,
    };
    axios
      .put(
        BASE_URL + API_URLS.UPDATE_COMMENT + `/` + seleectedItem._id,
        body,
        myHeader,
      )
      .then(response => {
        console.log(response.data, '==response delete====='),
          setloading(false),
          setOpenupdatecommentmodal(false);
        fetchComent();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  };
  const renderItem = ({item, index}) => {
    console.log(item, '==comenr');
    return (
      <View
        style={{
          width: '90%',
          height: 100,
          backgroundColor: Colors.black4,
          alignSelf: 'center',
          marginTop: 20,
          borderRadius: 15,
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              source={{uri: item?.userId?.profilePic}}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: 'stretch',
              }}
            />
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text style={{color: Colors.white, fontWeight: '500'}}>
                {item.username}
              </Text>
              <Text style={{color: Colors.white}}>
                <TimeAgo timestamp={item.createdAt} />
              </Text>
            </View>
          </View>

          {auth?.data?.data._id == item.userId?._id ? (
            <TouchableOpacity
              onPress={() => {
                setcommentOption(true);
                setseleectedItem(item);
              }}>
              <Image
                source={ImagePath.menu}
                style={{width: 20, height: 20, tintColor: Colors.white}}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={{margin: 4, color: Colors.white}}>{item.comment}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <CommentOptionmodal
        visible={commentOption}
        onClick={x => {
          setcommentOption(false);
          if (x == 2) {
            deleteComment();
          }
          if (x == 1) {
            setnewcomment(seleectedItem.comment);
            setOpenupdatecommentmodal(true);
          }
        }}
        onClose={() => setcommentOption(false)}
      />
      <FlatList
        data={commentList}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomView}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.white}
          placeholder="Type comment here..."
          value={comment}
          onChangeText={txt => setComment(txt)}
        />
        <TouchableOpacity
          onPress={() => postComment()}
          disabled={comment == '' ? true : false}
          style={[
            styles.postbtn,
            {
              backgroundColor: comment == '' ? Colors.placeColor : Colors.black,
            },
          ]}>
          <Text style={[styles.btntxt]}> comment</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={openupdatecommentmodal}>
        <View style={styles.modalView}>
          <View style={styles.mainView}>
            <Text style={styles.editTx}>Edit Comment</Text>

            <TextInput
              value={newcomment}
              onChangeText={txt => setnewcomment(txt)}
              style={styles.commentinput}
              placeholderTextColor={Colors.white}
              placeholder="Type comment  here ..."
            />
            <View style={styles.bottomview}>
              <TouchableOpacity
                onPress={() => setOpenupdatecommentmodal(false)}
                style={styles.cancelbtn}>
                <Text style={[styles.btntxt, {color: Colors.black}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateComment()}
                style={[styles.cancelbtn, {backgroundColor: Colors.black}]}>
                <Text style={styles.btntxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  cancelbtn: {
    width: '40%',
    height: 45,
    backgroundColor: Colors.placeColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomview: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  commentinput: {
    width: '90%',
    height: heightPercentageToDP(7),
    paddingLeft: 20,
    borderWidth: 2,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    color: Colors.white,
  },
  editTx: {
    fontSize: 16,
    color: Colors.white,
    alignSelf: 'center',
    marginTop: 20,
  },
  mainView: {
    width: '90%',
    backgroundColor: Colors.black5,
    borderRadius: 10,
    paddingBottom: 20,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black1,
  },
  bottomView: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.black4,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    lignItems: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    width: '70%',
    height: '100%',
    color: Colors.white,
  },
  postbtn: {
    width: '20%',
    height: '60%',
    backgroundColor: Colors.black3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: Colors.white,
  },
});
