import {StyleSheet, Text, View, Image, Linking, Alert} from 'react-native';
import React, {useState} from 'react';

import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Menu from '../components/Menu';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import {Colors} from '../utils/Colors';
import CommanModal from '../components/CommanModal';
import axios from 'axios';
import {logout} from '../redux/Slice/AuthSlice';

const SettingScreen = ({navigation}) => {
  const [showLogout, setshowLogout] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const id = auth?.data?.data?._id;
  const terms =
    'https://docs.google.com/document/d/1WMv3n6JYorljll-lidzxl5HzFFnBFH_BMkfJphsZbl4/edit?usp=sharing';
  const privacy_policy =
    'https://docs.google.com/document/d/1uHFfnleQuKNJySCYGmIHk13eRGZMcexTtWF450y_dyI/edit?usp=sharing';
  const aboutus =
    'https://docs.google.com/document/d/1YbSibadmexUyOE4QKXm7pL8Skn0HeZOlt2tnk_tB1Sk/edit?usp=sharing';

  const handlePress = async url => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const transferAndDeleteData = async () => {
    try {
      // Retrieve the original data
      axios
        .get(BASE_URL + API_URLS.DELETE_USER + '/' + id)
        .then(response => {
          console.log(response.data.status, '====fetcxh data===');
          if (response?.data?.status) {
            navigation.reset({
              index: 0,
              routes: [{name: RoutesName.SigninOption}],
            });
            dispatch(logout());
          }
        })
        .catch(error => {
          Alert.alert('Error', 'An error occurred during the operation');
          console.log(error);
        });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during the operation');
    }
  };

  return (
    <View style={{backgroundColor: Colors.black, flex: 1}}>
      <View
        style={{
          width: '100%',
          height: heightPercentageToDP(7),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.black3,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: Colors.white}}>
          Settings
        </Text>
      </View>

      <Menu
        icon={ImagePath.terms}
        name={'Terms & Condition'}
        onpress={() => handlePress(terms)}
      />
      <Menu
        icon={ImagePath.privacy}
        name={'Privacy Policy'}
        onpress={() => handlePress(privacy_policy)}
      />
      <Menu
        icon={ImagePath.info}
        name={'About Us'}
        onpress={() => handlePress(aboutus)}
      />
      <Menu
        icon={ImagePath.logout2}
        name={'Delete Account'}
        onpress={() => setshowLogout(true)}
      />

      <CommanModal
        titel={'Delete Account'}
        showtxt={'Are you sure for Delete your account?'}
        cancelpress={() => setshowLogout(false)}
        savedata={() => {
          setshowLogout(false);
          transferAndDeleteData();
        }}
        status={showLogout}
      />
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
