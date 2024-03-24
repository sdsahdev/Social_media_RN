import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import TimeAgo from '../components/TimeAgo';
import { Colors } from '../utils/Colors';
import { API_URLS, BASE_URL, ImagePath } from '../utils/Strings';

const Home = () => {
  const data = useSelector(state => state.auth);
  const [postdata, setPostData] = useState([]);
  useEffect(() => {
    featchData();
  }, []);

  const featchData = () => {
    axios 
      .get(BASE_URL + API_URLS.GET_POST_URL)
      .then(res => {
        console.log(res.data.data);
        console.log('====================================');
        setPostData(res?.data.data);
      })
      .catch(e => {
        console.log('====================================');
        console.log(e);
        console.log('====================================');
      });
  };
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.feed}>
        <View style={styles.topView}>
          <View style={styles.topLeft}>
            <Image source={ImagePath.usericon} style={styles.profile} />
            <View style={styles.usernameView}>
              <Text style={styles.captiontxt}>{item.username}</Text>
              <Text>User post created: <TimeAgo timestamp={item.createdAt} /></Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image source={ImagePath.menu} style={{width: 24, height: 24}} />
          </TouchableOpacity>
        </View>
        <Text style={styles.capttxt}>{item.caption}</Text>

      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.titel}>Sosial</Text>
      <FlatList
        data={postdata}
        renderItem={(item, index) => renderItem(item, index)}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
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
    paddingBottom:20
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
