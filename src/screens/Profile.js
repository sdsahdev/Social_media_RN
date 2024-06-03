import {useIsFocused} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image} from 'react-native-animatable';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import EditCapsion from '../components/EditCapsion';
import Loader from '../components/Loader';
import OptionModal from '../components/OptionModal';
import TimeAgo from '../components/TimeAgo';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
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
import FastImage from 'react-native-fast-image';

const Profile = ({navigation}) => {
  const auth = useSelector(state => state.auth);
  const isFocused = useIsFocused();
  const [profileData, setProfilData] = useState({});
  const [postdata, setpostData] = useState([]);
  const [openOpsion, setopenOpsion] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const [openEditM, setopenEditM] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      featchData();
    }
  }, [isFocused]);

  // like animation start
  const [animatedIndex, setAnimatedIndex] = useState(null);
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
  const featchData = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_URL + '/' + auth?.data?.data?._id)
      .then(response => {
        console.log(response.data, '====fetcxh data===');
        if (response.data.status) {
          setProfilData(response.data.data);
          getProfiledata(auth?.data?.data?._id);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const updatePost = caption => {
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
  const deletePost = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

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
  const getProfiledata = id => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_POST + '/' + auth?.data?.data?._id)
      .then(response => {
        if (response.data.status) {
          setpostData(response.data.data);
          console.log(response.data.data, '===user posts===');
          // setProfilData(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const likePost = item => {
    // setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = {
      id: auth?.data?.data._id,
    };
    axios
      .put(BASE_URL + API_URLS.LIKE_POST_URL + `/` + item._id, body)
      .then(response => {
        console.log(response.data, '==response delete====='),
          // setloading(false),
          featchData();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  };

  const renderItem = ({item, index}) => {
    console.log(item?.userId?.profilePic);
    const checkLike = item.likes.find(like => like == auth?.data?.data._id);
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={[
            styles.feed,
            {marginBottom: postdata.length - 1 == index ? 100 : 0},
          ]}>
          <View style={styles.topView}>
            <View style={styles.topLeft}>
              <FastImage
                source={
                  item?.userId?.profilePic
                    ? {uri: item?.userId?.profilePic}
                    : ImagePath.usericon
                }
                style={styles.profile}
              />
              <View style={styles.usernameView}>
                <Text style={styles.captiontxt}>{item?.username}</Text>
                <Text style={{color: Colors.white}}>
                  User post created: <TimeAgo timestamp={item?.createdAt} />
                </Text>
              </View>
            </View>
            {auth?.data?.data._id == item.userId?._id ? (
              <TouchableOpacity
                onPress={() => {
                  setopenOpsion(true), setselectedItem(item);
                }}>
                <Image
                  source={ImagePath.menu}
                  style={{width: 24, height: 24, tintColor: Colors.white}}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.capttxt}>{item.caption}</Text>

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
                source={
                  item.imageUrl ? {uri: item?.imageUrl} : ImagePath.gallaryicon
                }
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
                style={[
                  styles.heart,
                  {tintColor: checkLike ? Colors.red : Colors.white},
                ]}
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
              <FastImage source={ImagePath.chaticon} style={styles.heart} />
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
    <FlatList
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      style={styles.container}
      ListHeaderComponent={() => (
        <>
          <Loader visible={loading} />
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
          <View style={styles.coverAre}>
            {profileData.coverPic != null && profileData.coverPic != '' ? (
              <FastImage
                tin
                source={
                  profileData?.coverPic
                    ? {uri: profileData?.coverPic}
                    : ImagePath.gallaryicon
                }
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              />
            ) : null}
          </View>
          <View style={styles.profileView}>
            {profileData?.profilePic != '' ? (
              <FastImage
                source={
                  profileData?.profilePic
                    ? {uri: profileData?.profilePic}
                    : ImagePath?.usericon
                }
                style={[styles.profileView, {marginTop: 0, marginLeft: 0}]}
              />
            ) : (
              <>
                <FastImage source={ImagePath.usericon} style={styles.imaview} />
              </>
            )}
          </View>
          <Text style={styles.useRName}>
            {profileData ? profileData?.username : ''}
          </Text>
          <Text style={styles.emails}>
            {profileData ? profileData?.email : ''}
          </Text>
          <View style={styles.follwview}>
            <View style={styles.countView}>
              <Text style={styles.values}>
                {profileData.follower?.length
                  ? profileData?.follower?.length
                  : 0}
              </Text>
              <Text style={styles.titel}>Followers</Text>
            </View>
            <View style={styles.countView}>
              <Text style={styles.values}>
                {profileData.following?.length
                  ? profileData?.following?.length
                  : 0}
              </Text>
              <Text style={styles.titel}>Following</Text>
            </View>
            <View style={styles.countView}>
              <Text style={styles.values}>
                {postdata?.length ? postdata?.length : 0}
              </Text>
              <Text style={styles.titel}>Posts</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RoutesName.EditProfile, {
                  data: profileData,
                });
              }}
              style={styles.editBtn}>
              <Text style={styles.edittx}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RoutesName.SettingScreen);
              }}
              style={styles.editBtn}>
              <Text style={styles.edittx}>Settings</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      data={postdata}
      renderItem={(item, index) => renderItem(item, index)}
    />
  );
};

export default Profile;

export const styles = StyleSheet.create({
  profilebtn: {
    width: '100%',
    height: '100%',
  },
  coverAre: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.black3,
  },
  values: {fontSize: 18, fontWeight: '600', color: Colors.white},
  titel: {fontSize: 16, marginTop: 5, color: Colors.white},
  countView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  follwview: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    alignSelf: 'center',
  },
  edittx: {
    fontSize: 14,
    color: Colors.white,
    alignSelf: 'center',
    padding: 10,
  },
  editBtn: {
    width: '30%',
    height: heightPercentageToDP(7),
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
  },
  useRName: {
    fontSize: 17,
    marginTop: 10,
    fontWeight: '500',
    color: Colors.white,
    marginLeft: 20,
  },
  emails: {
    fontSize: 14,
    marginLeft: 20,
    color: Colors.white,
    width: '90%',
    fontWeight: '400',
  },
  profileView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.placeColor,
    marginTop: -50,
    marginLeft: 10,
  },
  imaview: {width: 50, height: 50, tintColor: Colors.white},
  container: {
    flex: 1,
    backgroundColor: Colors.black1,
  },
  followtxt: {color: Colors.white},
  follwobtn: {
    height: hp(6),
    backgroundColor: Colors.black3,
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
    marginHorizontal: 10,
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
    // backgroundColor: Colors.background,
    marginTop: 20,
    borderRadius: 15,
    alignSelf: 'center',
    paddingBottom: 20,
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
