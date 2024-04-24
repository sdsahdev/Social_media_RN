import {useIsFocused} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

import EditCapsion from '../components/EditCapsion';
import Loader from '../components/Loader';
import OptionModal from '../components/OptionModal';
import TimeAgo from '../components/TimeAgo';
import {Colors} from '../utils/Colors';

import {logout} from '../redux/Slice/AuthSlice';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import {getSocket} from '../socket/socket';
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import CommanModal from '../components/CommanModal';
const Home = ({navigation}) => {
  const isFocused = useIsFocused();
  const socket = getSocket();
  const data = useSelector(state => state.auth);
  const [postdata, setPostData] = useState([]);
  const [followListdata, setfollowList] = useState([]);
  const [loading, setloading] = useState(false);
  const [openOpsion, setopenOpsion] = useState(false);
  const [openEditM, setopenEditM] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const auth = useSelector(state => state.auth);
  const token = useSelector(state => state.auth.token);
  const [animatedIndex, setAnimatedIndex] = useState(null);
  const [showLogout, setshowLogout] = useState(false);
  console.log(socket.id, '===socketid====');

  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      featchData();
      followList();
    }
  }, [isFocused]);

  // like animation start
  const scale = useSharedValue(0);
  const ImageComappoennt = Animated.createAnimatedComponent(Image);

  const dobleTab = useCallback(index => {
    setAnimatedIndex(index);
    scale.value = withSpring(1, undefined, isFinish => {
      if (isFinish) {
        scale.value = withDelay(100, withSpring(0));
      }
    });
  }, []);

  const animatedStle = useAnimatedStyle(() => {
    return {
      transform: [{scale: Math.max(scale.value, 0)}],
    };
  });

  // close code
  const followList = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_URL + '/' + auth?.data?.data?._id)
      .then(response => {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data.data.following, '====list==');
          setfollowList(response.data.data.following);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const featchData = () => {
    setloading(false);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include token in headers
    };

    console.log(headers);
    axios
      .get(BASE_URL + API_URLS.GET_POST_URL, {headers: headers})
      .then(res => {
        setloading(false);
        console.log(res.data, '======');
        setPostData(res?.data.data.reverse());
      })
      .catch(e => {
        setloading(false);

        console.log(e.response.data, '==error==');
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
      console.log(id, '==body==');
      console.log(body, '==body==');
      axios
        .put(BASE_URL + API_URLS.FOLLOW_USER + '/' + id, body, myHeader)
        .then(response => {
          setloading(false);
          followList();
          console.log(response.data, '==response follow====='),
            setloading(false);
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

  const deletePost = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    console.log(BASE_URL + API_URLS.DELETE_POST_URL + '/' + selectedItem._id);
    axios
      .delete(BASE_URL + API_URLS.DELETE_POST_URL + '/' + selectedItem._id)
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
      .put(BASE_URL + API_URLS.UPDATE_POST_URL + '/' + selectedItem._id, body)
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
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = {
      id: auth?.data?.data._id,
    };
    axios
      .put(BASE_URL + API_URLS.LIKE_POST_URL + '/' + item._id, body)
      .then(response => {
        console.log(response.data, '==response delete====='), featchData();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  };

  const renderItem = ({item, index}) => {
    console.log(item);

    const checkLike = item.likes.find(like => like == auth?.data?.data._id);
    const followCheck = followListdata.find(
      follow => follow == item.userId?._id,
    );
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={[
            styles.feed,
            {
              marginBottom: postdata.length - 1 == index ? 100 : 0,
              alignItems: 'center',
            },
          ]}>
          <View style={styles.topView}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(RoutesName.OtherProfile, {
                  id: item.userId?._id,
                })
              }
              style={styles.topLeft}>
              <Image
                source={
                  item?.userId?.profilePic
                    ? {uri: item?.userId?.profilePic}
                    : ImagePath.usericon
                }
                style={styles.profile}
              />
              <View style={styles.usernameView}>
                <Text
                  style={[styles.captiontxt, {fontFamily: 'Raleway-Medium'}]}>
                  {item.username}
                </Text>
                <Text
                  style={{color: Colors.white, fontFamily: 'Raleway-Regular'}}>
                  User post created: <TimeAgo timestamp={item.createdAt} />
                </Text>
              </View>
            </TouchableOpacity>
            {auth?.data?.data._id == item.userId?._id ? (
              <TouchableOpacity
                onPress={() => {
                  setopenOpsion(true), setselectedItem(item);
                }}>
                <Image
                  source={ImagePath.menu}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => followApi(item.userId?._id)}
                style={styles.follwobtn}>
                <Text style={[styles.followtxt, {fontFamily: 'Raleway-Bold'}]}>
                  {followCheck ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.capttxt, {fontFamily: 'Raleway-Medium'}]}>
            {item.caption}
          </Text>
          <TapGestureHandler
            maxDelayMs={250}
            numberOfTaps={2}
            onActivated={() => {
              dobleTab(index), likePost(item);
            }}>
            <Animated.View
              style={{
                flex: 1,
                width: '100%',
                height: 200,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ImageBackground
                source={{uri: item.imageUrl}}
                style={[
                  styles.imagePost,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                {animatedIndex === index && item.imageUrl !== '' && (
                  <ImageComappoennt
                    source={ImagePath.hearticon}
                    style={[
                      {
                        width: 100,
                        height: 100,
                        tintColor: checkLike ? 'red' : Colors.white,
                      },
                      animatedStle,
                    ]}
                  />
                )}
              </ImageBackground>
            </Animated.View>
          </TapGestureHandler>
          <View style={styles.bottomView}>
            <TouchableOpacity
              onPress={() => {
                likePost(item);
              }}
              style={styles.bottomLeft}>
              <Image
                source={ImagePath.hearticon}
                style={[styles.heart, {tintColor: checkLike ? 'red' : 'white'}]}
              />
              <Text style={styles.captiontxt}>
                {` ${item.likes.length} Likes`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RoutesName.Comment, {id: item._id});
              }}
              style={styles.bottomLeft}>
              <Image source={ImagePath.chaticon} style={styles.heart} />
              <Text style={styles.captiontxt}>
                {` ${item.comments.length ? item.comments.length : 0} comments`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    );
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
      <Text style={[styles.titel, {fontFamily: 'Dancing Script Bold'}]}>
        Flex Flipe
      </Text>
      <TouchableOpacity
        onPress={() => {
          setshowLogout(true);
        }}
        style={{position: 'absolute', right: 10, top: 10}}>
        <Image
          source={ImagePath.closeicon}
          style={{width: 24, height: 24, tintColor: Colors.white}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(RoutesName.ChatScreen);
        }}
        style={{position: 'absolute', right: 50, top: 10}}>
        <Image
          source={ImagePath.chaticon}
          style={{width: 24, height: 24, tintColor: Colors.white}}
        />
      </TouchableOpacity>
      <FlatList
        data={postdata}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
      <CommanModal
        titel={'Logout'}
        showtxt={'Are you sure for logout?'}
        cancelpress={() => setshowLogout(false)}
        savedata={() => {
          setshowLogout(false);
          dispatch(logout());
          navigation.navigate(RoutesName.Signup);
        }}
        status={showLogout}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  followtxt: {color: Colors.white},
  follwobtn: {
    height: hp(6),
    backgroundColor: Colors.black5,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  bottomLeft: {flexDirection: 'row'},
  heart: {width: 24, height: 24, tintColor: Colors.white},
  bottomView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: hp(2),
  },
  imagePost: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  capttxt: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
    color: Colors.white,
  },
  usernameView: {
    margin: 4,
  },
  timestam: {fontSize: 10, color: Colors.placeColor},
  captiontxt: {
    fontSize: 18,
    textAlignVertical: 'center',
    color: Colors.white,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 25,
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
    width: '100%',
    // backgroundColor: Colors.blackcombi,
    marginTop: 10,
    borderRadius: 15,
    alignSelf: 'center',
    paddingBottom: 20,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black1,
  },
  titel: {
    fontSize: 30,
    color: Colors.white,
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
