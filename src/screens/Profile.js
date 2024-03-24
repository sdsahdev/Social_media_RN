import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image, Text } from 'react-native-animatable';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { Colors } from '../utils/Colors';
import { API_URLS, BASE_URL, ImagePath } from '../utils/Strings';
const Profile = () => {
  const auth = useSelector(state => state.auth);
  const [profileData, setProfilData] = useState({});

  useEffect(() => {
    axios
      .get(BASE_URL + API_URLS.GET_USER_URL + '/' + auth?.data?.data?._id)
      .then(response => {
        console.log(response.data);
        if (response.data.status) {
          setProfilData(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.profileView}>
        <Image source={ImagePath.usericon} style={styles.imaview} />
      </View>
      <Text style={styles.useRName}>
        {profileData ? profileData?.username : ''}
      </Text>
      <Text style={styles.emails}>{profileData ? profileData?.email : ''}</Text>
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.edittx}>Edit Profile</Text>
      </TouchableOpacity>
      <View style={styles.follwview}>
        <View style={styles.countView}>
          <Text style={styles.values}>
            {profileData.follower?.lenght ? profileData?.follower?.lenght : 0}
          </Text>
          <Text style={styles.titel}>Followers</Text>
        </View>
        <View style={styles.countView}>
          <Text style={styles.values}>
            {profileData.following?.lenght ? profileData?.following?.lenght : 0}
          </Text>
          <Text style={styles.titel}>Following</Text>
        </View>
        <View style={styles.countView}>
          <Text style={styles.values}>
            {profileData.follower?.lenght ? profileData?.follower?.lenght : 0}
          </Text>
          <Text style={styles.titel}>Posts</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  values: {fontSize: 30, fontWeight: '600'},
  titel: {fontSize: 20, marginTop: 5},
  countView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  follwview: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  edittx: {
    fontSize: 16,
    color: Colors.black,
    alignSelf: 'center',
  },
  editBtn: {
    width: '50%',
    height: heightPercentageToDP(6),
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  useRName: {
    fontSize: 20,
    marginTop: 20,
    alignSelf: 'center',
    fontWeight: '500',
    color: Colors.black,
  },
  emails: {
    fontSize: 17,
    marginTop: 10,
    alignSelf: 'center',
    fontWeight: '300',
    color: Colors.black,
  },
  profileView: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: Colors.placeColor,
    alignSelf: 'center',
    marginTop: 20,
  },
  imaview: {width: 50, height: 50, tintColor: Colors.white},
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
