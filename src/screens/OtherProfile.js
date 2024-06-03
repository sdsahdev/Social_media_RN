import {useIsFocused, useRoute} from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
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
import FastImage from 'react-native-fast-image';
const OtherProfile = ({navigation}) => {
  const auth = useSelector(state => state.auth);
  const rotes = useRoute();
  const otheruserid = rotes.params.id;
  const isFocused = useIsFocused();
  const [profileData, setProfilData] = useState({});
  const [postdata, setpostData] = useState([]);
  const [openOpsion, setopenOpsion] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const [openEditM, setopenEditM] = useState(false);
  const [loading, setloading] = useState(false);
  const [followListdata, setfollowList] = useState([]);
  useEffect(() => {
    if (isFocused) {
      featchData();
      followList();
    }
  }, [isFocused]);
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

  const featchData = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_URL + '/' + otheruserid)
      .then(response => {
        console.log(response.data, '====fetcxh data===');
        if (response.data.status) {
          setProfilData(response.data.data);
          setfollowList(response.data.data.following);
          getProfiledata();
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
  const getProfiledata = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_POST + '/' + otheruserid)
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
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = {
      id: otheruserid,
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

  const renderItem = ({item, index}) => {
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
            <FastImage source={ImagePath.usericon} style={styles.profile} />
            <View style={styles.usernameView}>
              <Text style={styles.captiontxt}>{item.username}</Text>
              <Text style={{color: Colors.white}}>
                <TimeAgo timestamp={item.createdAt} />
              </Text>
            </View>
          </View>
          {auth?.data?.data._id == item.userId ? (
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
              onPress={() => followApi(item.userId)}
              style={styles.follwobtn}>
              <Text style={styles.followtxt}>
                {followCheck ? 'Unfollow' : 'Follow'}{' '}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.capttxt}>{item.caption}</Text>

        {item.imageUrl != '' && (
          <FastImage source={{uri: item.imageUrl}} style={styles.imagePost} />
        )}
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
            <FastImage
              tintColor={Colors.white}
              source={ImagePath.chaticon}
              style={styles.heart}
            />
            <Text style={styles.captiontxt}>
              {` ${item.comments.length ? item.comments.length : 0} comments`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
                source={{uri: profileData.coverPic}}
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              />
            ) : null}
          </View>

          <View style={styles.profileView}>
            {profileData?.profilePic != '' ? (
              <FastImage
                source={{uri: profileData?.profilePic}}
                style={[styles.profileView, {marginTop: 0, marginLeft: 0}]}
              />
            ) : (
              <>
                <FastImage
                  tintColor={Colors.white}
                  source={ImagePath.usericon}
                  style={styles.imaview}
                />
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
          {auth.data != null && auth?.data?.data._id == otheruserid ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RoutesName.EditProfile, {
                  data: profileData,
                });
              }}
              style={styles.editBtn}>
              <Text style={styles.edittx}>Edit Profile</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.backbtn}
            onPress={() => navigation.pop()}>
            <FastImage
              source={ImagePath.back}
              tintColor={Colors.white}
              style={{width: wp(5), height: wp(5), margin: 7}}
            />
          </TouchableOpacity>
        </>
      )}
      data={postdata}
      renderItem={(item, index) => renderItem(item, index)}
    />
  );
};

export default OtherProfile;
const styles = StyleSheet.create({
  backbtn: {
    position: 'absolute',
    backgroundColor: Colors.black,
    borderRadius: 10,
    margin: 15,
  },
  profilebtn: {
    width: '100%',
    height: '100%',
  },
  coverAre: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.black2,
  },
  values: {fontSize: 25, fontWeight: '600', color: Colors.white},
  titel: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  countView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  follwview: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignSelf: 'center',
  },
  edittx: {
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    padding: 10,
  },
  editBtn: {
    width: '90%',
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
    fontSize: 25,
    marginTop: 10,
    fontWeight: '500',
    color: Colors.white,
    marginLeft: 20,
  },
  emails: {
    fontSize: 18,
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
    backgroundColor: Colors.black2,
    marginTop: -50,
    marginLeft: 10,
  },
  imaview: {width: 50, height: 50, tintColor: Colors.white},
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  followtxt: {color: Colors.black},
  follwobtn: {
    height: hp(6),
    backgroundColor: Colors.white,
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
  timestam: {fontSize: 10, color: Colors.white},
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
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 25,
    tintColor: Colors.white,
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
