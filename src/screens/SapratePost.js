import {useIsFocused, useRoute} from '@react-navigation/native'; // Import the hook
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
import EditCapsion from '../components/EditCapsion';
import Loader from '../components/Loader';
import OptionModal from '../components/OptionModal';
import TimeAgo from '../components/TimeAgo';
import {Colors} from '../utils/Colors';

import {logout} from '../redux/Slice/AuthSlice';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import {getSocket} from '../socket/socket';
import CommanModal from '../components/CommanModal';
import FastImage from 'react-native-fast-image';
const SapratePost = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const socket = getSocket();
  const token = useSelector(state => state.auth.token);
  const data = useSelector(state => state.auth);
  const auth = useSelector(state => state.auth);

  const onepostID = route.params.userId;

  console.log(onepostID, '===devv====id');
  const [item, setItem] = useState({});
  const [followListdata, setfollowList] = useState([]);
  const [loading, setloading] = useState(false);
  const [openOpsion, setopenOpsion] = useState(false);
  const [openEditM, setopenEditM] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);

  const [showLogout, setshowLogout] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      featchData();
      followList();
    }
  }, [onepostID]);

  // like animation start
  const scale = useSharedValue(0);
  const ImageComappoennt = Animated.createAnimatedComponent(Image);

  const dobleTab = useCallback(() => {
    console.log('clicks');
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
  const featchData = () => {
    console.log(onepostID, '==dev linking===');
    setloading(false);
    const headers = {
      'Content-Type': 'application/json',
    };

    console.log(headers);
    axios
      .get(`${BASE_URL}${API_URLS.GET_SINGLE_POST_URL}/${onepostID}`, {
        headers: headers,
      })
      .then(res => {
        setloading(false);
        console.log(res.data, '======');
        setItem(res?.data.data);
      })
      .catch(e => {
        setloading(false);

        console.log(e.response.data, '==error==');
      });
  };

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
  // console.log(item.likes);
  const checkLike = item?.likes?.find(like => like == auth?.data?.data._id);
  const followCheck = followListdata?.find(
    follow => follow == item?.userId?._id,
  );

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: Colors.black}}>
      <View
        style={[
          styles.feed,
          {
            marginBottom: 100,
            alignItems: 'center',
            flex: 1,
          },
        ]}>
        {/* top contaner */}
        <View style={[styles.topView]}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RoutesName.OtherProfile, {
                id: item.userId?._id,
              })
            }
            style={styles.topLeft}>
            {console.log(item?.userId?.profilePic, '==imgcheck==')}
            <FastImage
              source={
                item?.userId?.profilePic
                  ? {uri: item?.userId?.profilePic}
                  : ImagePath.usericon
              }
              style={styles.profile}
            />
            <View style={styles.usernameView}>
              <Text style={[styles.captiontxt, {fontFamily: 'Raleway-Medium'}]}>
                {item.username}
              </Text>
              <Text
                style={{color: Colors.white, fontFamily: 'Raleway-Regular'}}>
                <TimeAgo timestamp={item?.createdAt} />
              </Text>
            </View>
          </TouchableOpacity>
          {auth?.data?.data._id == item?.userId?._id ? (
            <TouchableOpacity
              onPress={() => {
                setopenOpsion(true), setselectedItem(item);
              }}>
              <FastImage
                source={ImagePath.menu}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => followApi(item?.userId?._id)}
              style={styles.follwobtn}>
              <Text style={[styles.followtxt, {fontFamily: 'Raleway-Bold'}]}>
                {followCheck ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {item.caption && (
          <Text style={[styles.capttxt, {fontFamily: 'Raleway-Medium'}]}>
            {`Description : ${item?.caption}`}
          </Text>
        )}
        {/* image cotainer */}
        <View style={{height: 200}}>
          {item?.imageUrl ? (
            <TapGestureHandler
              maxDelayMs={250}
              numberOfTaps={2}
              onActivated={() => {
                console.log('click=====');
                dobleTab(), likePost(item);
              }}>
              <Animated.View
                style={{
                  width: wp(100),
                  height: 200,
                  alignItems: 'center',
                }}>
                {console.log(item?.imageUrl, '==imgcheck==02')}

                <ImageBackground
                  source={
                    item?.imageUrl
                      ? {uri: item?.imageUrl}
                      : ImagePath.gallaryicon
                  }
                  style={[
                    styles.imagePost,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  {item?.imageUrl !== '' && (
                    <ImageComappoennt
                      source={ImagePath?.hearticon}
                      style={[
                        {
                          width: 100,
                          height: 100,
                          tintColor: checkLike ? Colors.red : Colors.white,
                        },
                        animatedStle,
                      ]}
                    />
                  )}
                </ImageBackground>
              </Animated.View>
            </TapGestureHandler>
          ) : null}
        </View>

        {/* like cotaner */}
        <View style={styles.bottomView}>
          <TouchableOpacity
            onPress={() => {
              likePost(item);
            }}
            style={styles.bottomLeft}>
            <Image
              source={ImagePath.hearticon}
              style={[
                styles.heart,
                {tintColor: checkLike ? Colors.red : 'white'},
              ]}
            />
            <Text style={styles.captiontxt}>
              {` ${item?.likes?.length} Likes`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RoutesName.Comment, {id: item?._id});
            }}
            style={styles.bottomLeft}>
            <FastImage source={ImagePath.chaticon} style={styles.heart} />
            <Text style={styles.captiontxt}>
              {` ${
                item?.comments?.length ? item?.comments?.length : 0
              } Comments`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RoutesName.SapratePost, {id: item._id});
            }}
            style={styles.bottomLeft}>
            <FastImage source={ImagePath.shareicon} style={styles.heart} />
            <Text style={styles.captiontxt}>{` Share`}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* other codes */}
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
    </GestureHandlerRootView>
  );
};

export default SapratePost;

const styles = StyleSheet.create({
  followtxt: {color: Colors.white},
  follwobtn: {
    backgroundColor: Colors.black5,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: wp(10),
    width: wp(20),
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomLeft: {flexDirection: 'row'},
  heart: {width: 24, height: 24, tintColor: Colors.white},
  bottomView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: hp(2),
    position: 'relative',
  },
  imagePost: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  capttxt: {
    width: '100%',
    marginTop: 10,
    alignSelf: 'center',
    color: Colors.white,
    marginLeft: 10,
  },
  usernameView: {
    margin: 4,
  },
  timestam: {fontSize: 10, color: Colors.placeColor},
  captiontxt: {
    fontSize: 15,
    textAlignVertical: 'center',
    color: Colors.white,
    textAlign: 'center',
  },
  topView: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingTop: 10,
    alignItems: 'center',
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
  },

  feed: {
    width: '100%',
    borderRadius: 15,
    alignSelf: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black1,
  },
  titel: {
    fontSize: 30,
    color: Colors.white,
    marginHorizontal: wp(6),
  },

  bottamTab: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
