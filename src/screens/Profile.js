import { useIsFocused } from '@react-navigation/native'; // Import the hook
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'react-native-animatable';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import EditCapsion from '../components/EditCapsion';
import Loader from '../components/Loader';
import OptionModal from '../components/OptionModal';
import TimeAgo from '../components/TimeAgo';
import { Colors } from '../utils/Colors';
import { API_URLS, BASE_URL, ImagePath, RoutesName } from '../utils/Strings';

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

  const featchData = () => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_URL + '/' + auth?.data?.data?._id)
      .then(response => {
        console.log(response.data, "====fetcxh data===");
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

  const renderItem = ({item, index}) => {

    const checkLike = item.likes.find(like => like == auth?.data?.data._id);
    // const followCheck = followListdata.find(follow => follow == item.userId);
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
          ) : null}
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

  return (
    // <View style={styles.container}>
    // <View style={styles.profileView}>
    //   <Image source={ImagePath.usericon} style={styles.imaview} />
    // </View>
    // <Text style={styles.useRName}>
    //   {profileData ? profileData?.username : ''}
    // </Text>
    // <Text style={styles.emails}>{profileData ? profileData?.email : ''}</Text>
    // <TouchableOpacity style={styles.editBtn}>
    //   <Text style={styles.edittx}>Edit Profile</Text>
    // </TouchableOpacity>
    // <View style={styles.follwview}>
    //   <View style={styles.countView}>
    //     <Text style={styles.values}>
    //       {profileData.follower?.length ? profileData?.follower?.length : 0}
    //     </Text>
    //     <Text style={styles.titel}>Followers</Text>
    //   </View>
    //   <View style={styles.countView}>
    //     <Text style={styles.values}>
    //       {profileData.following?.length ? profileData?.following?.length : 0}
    //     </Text>
    //     <Text style={styles.titel}>Following</Text>
    //   </View>
    //   <View style={styles.countView}>
    //     <Text style={styles.values}>
    //       {profileData.follower?.length ? profileData?.follower?.length : 0}
    //     </Text>
    //     <Text style={styles.titel}>Posts</Text>
    //   </View>
    //   </View>
    // </View>

    <ScrollView
      nestedScrollEnabledm
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <View style={styles.coverAre}></View>
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
      <View style={styles.profileView}>
        <Image source={ImagePath.usericon} style={styles.imaview} />
      </View>
      <Text style={styles.useRName}>
        {profileData ? profileData?.username : ''}
      </Text>
      <Text style={styles.emails}>{profileData ? profileData?.email : ''}</Text>
      <View style={styles.follwview}>
        <View style={styles.countView}>
          <Text style={styles.values}>
            {profileData.follower?.length ? profileData?.follower?.length : 0}
          </Text>
          <Text style={styles.titel}>Followers</Text>
        </View>
        <View style={styles.countView}>
          <Text style={styles.values}>
            {profileData.following?.length ? profileData?.following?.length : 0}
          </Text>
          <Text style={styles.titel}>Following</Text>
        </View>
        <View style={styles.countView}>
          <Text style={styles.values}>
            {profileData.follower?.length ? profileData?.follower?.length : 0}
          </Text>
          <Text style={styles.titel}>Posts</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(RoutesName.EditProfile, {data: profileData});
        }}
        style={styles.editBtn}>
        <Text style={styles.edittx}>Edit Profile</Text>
      </TouchableOpacity>

      <FlatList
        data={postdata}
        renderItem={(item, index) => renderItem(item, index)}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  coverAre: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.dark_theme3,
  },
  values: {fontSize: 25, fontWeight: '600', color: Colors.black},
  titel: {fontSize: 16, marginTop: 5, color: Colors.black},
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
    color: Colors.black,
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
  },
  useRName: {
    fontSize: 25,
    marginTop: 10,
    fontWeight: '500',
    color: Colors.black,
    marginLeft: 20,
  },
  emails: {
    fontSize: 18,
    marginLeft: 20,
    color: Colors.black,
    width: '90%',
    fontWeight: '400',
  },
  profileView: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: Colors.placeColor,
    marginTop: -50,
    marginLeft: 10,
  },
  imaview: {width: 50, height: 50, tintColor: Colors.white},
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
