import { useIsFocused } from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import EditCapsion from '../components/EditCapsion';
import Loader from '../components/Loader';
import OptionModal from '../components/OptionModal';
import TimeAgo from '../components/TimeAgo';
import { Colors } from '../utils/Colors';

import { logout } from '../redux/Slice/AuthSlice';
import { API_URLS, BASE_URL, ImagePath, RoutesName } from '../utils/Strings';

const Home = ({navigation}) => {
  const isFocused = useIsFocused();
  const data = useSelector(state => state.auth);
  const [postdata, setPostData] = useState([]);
  const [followListdata,setfollowList] = useState([]);
  const [loading, setloading] = useState(false);
  const [openOpsion, setopenOpsion] = useState(false);
  const [openEditM, setopenEditM] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      featchData();
      followList()
    }
  }, [isFocused]);

  const followList= () =>{
    axios
    .get(BASE_URL + API_URLS.GET_USER_URL + '/' + auth?.data?.data?._id)
    .then(response => {
      console.log(response.data);
      if (response.data.status) {
        console.log(response.data.data.following , "====list==");
        setfollowList(response.data.data.following);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  const featchData = () => {
    setloading(true);
    axios
      .get(BASE_URL + API_URLS.GET_POST_URL)
      .then(res => {
        setloading(false);

        setPostData(res?.data.data.reverse());
      })
      .catch(e => {
        setloading(false);
        console.log(e, '==error==');
      });
  };
  const followApi = id => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    try {
      const body = {
        id: auth?.data?.data._id,
      };
      console.log(id, "==body==");
      console.log(body, "==body==");
      axios
        .put(BASE_URL + API_URLS.FOLLOW_USER+"/"+id, body, myHeader)
        .then(response => {
          setloading(false);
          followList();
          console.log(response.data, '==response follow====='), setloading(false);
        })
        .catch(error => {
          setloading(false);
          console.log(error, '=====error follow==='), setloading(false);
        });
    } catch (e) {
      setloading(false);
      console.log(e, '===error ===');
    }
  };

  const renderItem = ({item, index}) => {
    console.log(item);
    const checkLike = item.likes.find(like => like == auth?.data?.data._id);
    const followCheck = followListdata.find(follow => follow == item.userId);
    return (
      <View
        style={[
          styles.feed,
          {marginBottom: postdata.length - 1 == index ? 100 : 0},
        ]}>
        <View style={styles.topView}>
          <View style={styles.topLeft}>
            <Image source={ImagePath.usericon} style={styles.profile} />
            <View style={styles.usernameView}>
              <Text style={styles.captiontxt}>{item.username}</Text>
              <Text>
                User post created: <TimeAgo timestamp={item.createdAt} />
              </Text>
            </View>
          </View>
          {auth?.data?.data._id == item.userId ? (
            <TouchableOpacity
              onPress={() => {
                setopenOpsion(true), setselectedItem(item);
              }}>
              <Image source={ImagePath.menu} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => followApi(item.userId)}
              style={styles.follwobtn}>
              <Text style={styles.followtxt}>{followCheck ? 'Unfollow' : "Follow"} </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.capttxt}>{item.caption}</Text>

        {item.imageUrl != '' && (
          <Image source={{uri: item.imageUrl}} style={styles.imagePost} />
        )}
        <View style={styles.bottomView}>
          <TouchableOpacity
            onPress={() => {
              likePost(item);
            }}
            style={styles.bottomLeft}>
            <Image
              source={ImagePath.hearticon}
              style={[styles.heart, {tintColor: checkLike ? 'red' : 'black'}]}
            />
            <Text style={styles.captiontxt}>{item.likes.length} Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RoutesName.Comment, {id: item._id});
            }}
            style={styles.bottomLeft}>
            <Image source={ImagePath.chaticon} style={styles.heart} />
            <Text style={styles.captiontxt}>
              {item.comments.length ? item.comments.length : 0} comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const deletePost = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    console.log(BASE_URL + API_URLS.DELETE_POST_URL + `/` + selectedItem._id);
    axios
      .delete(BASE_URL + API_URLS.DELETE_POST_URL + `/` + selectedItem._id)
      .then(response => {
        console.log(response.data, '==response delete====='),
          setloading(false),
          featchData();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  };

  const updatePost = caption => {
    console.log(caption);
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    const body = {
      caption: caption,
    };
    axios
      .put(BASE_URL + API_URLS.UPDATE_POST_URL + `/` + selectedItem._id, body)
      .then(response => {
        console.log(response.data, '==response delete====='),
          setloading(false),
          featchData();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  };
  const likePost = item => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = {
      id: auth?.data?.data._id,
    };
    axios
      .put(BASE_URL + API_URLS.LIKE_POST_URL + `/` + item._id, body)
      .then(response => {
        console.log(response.data, '==response delete====='),
          setloading(false),
          featchData();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  };

  return (
    <View style={styles.container}>
      <OptionModal
        visible={openOpsion}
        onClick={x => {
          setopenOpsion(false);
          if (x == 2) {
            console.log('delete called');
            deletePost();
          } else {
            setopenEditM(true);
          }
        }}
        onClose={() => {
          setopenOpsion(false);
        }}
      />
      <EditCapsion
        data={selectedItem}
        visible={openEditM}
        onClick={x => {
          setopenEditM(false), updatePost(x);
        }}
        onClose={() => setopenEditM(false)}
      />
      <Loader visible={loading} />
      <Text style={styles.titel}>Sosial</Text>
      <TouchableOpacity
        onPress={() => {
          dispatch(logout());
          navigation.navigate(RoutesName.Splash);
        }}
        style={{position: 'absolute', right: 10, top: 10}}>
        <Image source={ImagePath.closeicon} style={{width: 24, height: 24}} />
      </TouchableOpacity>
      <FlatList
        data={postdata}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  followtxt: {color: Colors.white},
  follwobtn: {
    height: hp(6),
    backgroundColor: Colors.dark_theme3,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  bottomLeft: {flexDirection: 'row'},
  heart: {width: 24, height: 24},
  bottomView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: hp(2),
  },
  imagePost: {
    width: '90%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  capttxt: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
  },
  usernameView: {
    margin: 4,
  },
  timestam: {fontSize: 10, color: Colors.placeColor},
  captiontxt: {
    fontSize: 18,
    textAlignVertical: 'center',
    color: Colors.placeColor,
  },
  topView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingTop: 10,
  },
  topLeft: {
    flexDirection: 'row',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 25,
    tintColor: Colors.placeColor,
    marginLeft: 10,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  feed: {
    width: '90%',
    backgroundColor: Colors.background,
    marginTop: 20,
    borderRadius: 15,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titel: {
    fontSize: 28,
    color: Colors.dark_theme2,
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  bottomnav: {
    width: '100%',
    height: hp(10),
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bottamTab: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
