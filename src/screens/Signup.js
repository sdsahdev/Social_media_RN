import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from "react-native-flash-message";
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import CustomTextInput from '../components/CustomTextInput';
import Loader from '../components/Loader';
import { setAuthdata } from '../redux/Slice/AuthSlice';
import { Colors } from '../utils/Colors';
import { API_URLS, BASE_URL, ImagePath, RoutesName } from '../utils/Strings';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [selectedGender, setselectedGender] = useState(0);
  
  const [username, setUsername] = useState('');
  const [badUsername, setBadUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [badMobile, setBadMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const validate = () => {
    let isValided = false;

    // email
    if (email == '') {
      isValided = false;
      setBadEmail('Please Enter Emaile');
    } else if (
      email != '' &&
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
    ) {
      setBadEmail('Please Enter valide Emaile');
      isValided = false;
    } else {
      isValided = true;
      setBadEmail('');
    }

    // password
    if (password == '') {
      isValided = false;
      setBadPassword('Please Enter Password');
    } else if (password.length <= 5) {
      setBadPassword('Please Enter Min 6 charaters  Password ');
      isValided = false;
    } else if (password != '' && password.length >= 6) {
      isValided = true;
      setBadPassword('');
    }

    // phone number
    if (mobile == '') {
      isValided = false;
      setBadMobile('Please Enter Mobile Number');
    } else if (mobile.length != 10) {
      setBadMobile('Please Enter Valided Mobile Number');
      isValided = false;
    }else{
      isValided = true;
      setBadMobile('');
    }

    // UserName
    if (username == '') {
      isValided = false;
      setBadUsername('Please Enter Username');
    } else{
      isValided = true;
      setBadUsername('');
    }

    // gender


    return isValided;
  };

  const register = () => {
    setLoading(true);
    console.log(BASE_URL + API_URLS.REGISTER_URL);
    fetch(BASE_URL + API_URLS.REGISTER_URL, {
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
        username:username,
        mobile:mobile,
        gender:selectedGender == 0 ? 'Male' : "Female"
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json', // I added this line
      },
      method: 'POST',
    })
      .then(response => response.json())
      .then(responseData => {
        setLoading(false);
        console.log(responseData);
        showMessage({
          message: responseData?.message,
          type: responseData.status ? 'success' : 'danger',
          backgroundColor: responseData.status ? "green" : 'red', // background color
          icon: responseData.status ? "success" : 'danger', // background color
          color: "#fff", // text color
      });
      if(responseData.status){
        dispatch(setAuthdata(responseData))
        navigation.navigate(RoutesName.BottomTab)
      }

      })
      .catch(error => {
        setLoading(false);
        console.log(error , "==error==");
        console.log(error?.response);
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1, }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Loader visible={loading} />

          <View
            style={{
              alignItems: 'center',
              margin: wp(10),
            }}>
            <Image
              style={styles.logo}
              source={ImagePath.logoicon}
            />
          </View>

          <Text style={styles.logoText}>Welcome Back {`\n`} to Sosal</Text>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <CustomTextInput
              icon={require('../Images/user.png')}
              placeholder={'Enter Name'}
              value={username}
              onChangeText={txt => setUsername(txt)}
              isValide={badUsername == '' ? true : false}
              errorMessage={badUsername}
            />
            <CustomTextInput
              icon={require('../Images/mail.png')}
              placeholder={'Enter Email'}
              value={email}
              onChangeText={txt => setEmail(txt)}
              isValide={badEmail == '' ? true : false}
              errorMessage={badEmail}
            />
            <CustomTextInput
              icon={require('../Images/phone-call.png')}
              placeholder={'Enter Mobile Number'}
              value={mobile}
              onChangeText={txt => setMobile(txt)}
              isValide={badMobile == '' ? true : false}
              errorMessage={badMobile}
              keyboardType={'number-pad'}
            />

            <CustomTextInput
              icon={require('../Images/padlock.png')}
              placeholder={'Enter Password'}
              value={password}
              onChangeText={txt => setPassword(txt)}
              isValide={badPassword == '' ? true : false}
              errorMessage={badPassword}
            />
            <View style={{flex: 1, margin: 4, marginBottom: 12}}>
              <Text style={styles.heading}>Select Gender</Text>
              <View
                style={styles.genderView}>


                <TouchableOpacity onPress={()=> {
                  setselectedGender(0);
                }} 
                style={[styles.male, {borderColor:selectedGender == 0 ? Colors.dark_theme1 : Colors.dark_theme3}]}>
                  <Image
                    source={ImagePath.manicon}
                    style={{width: 30, height: 30, resizeMode: 'cover'}}
                  />
                </TouchableOpacity>


                <TouchableOpacity
                onPress={()=> {
                  setselectedGender(1);
                }}
                style={[styles.male, {borderColor:selectedGender == 1 ?  Colors.dark_theme1: Colors.dark_theme3}]}>

                  <Image
                    source={ImagePath.girlicon}
                    style={{width: 30, height: 30, resizeMode: 'cover'}}
                  />
                </TouchableOpacity>


              </View>
            </View>
          </View>

          <View style={{flex: 1, width: '100%'}}>
            <LinearGradient
              colors={[Colors.dark_theme2, Colors.dark_theme3]}
              style={styles.button}>
              <TouchableOpacity
                onPress={() => {
                  if (validate()) {
                    register();
                  }
                }}
                style={[
                  styles.button,
                  {justifyContent: 'center', alignItems: 'center', margin: 0},
                ]}>
                <Text style={styles.btntxt}>Login</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={{flex: 1, marginBottom:10}}>
            <Text
              onPress={() => navigation.pop()}
              style={{color: Colors.dark_theme2, fontSize: 14}}>
             Alreay have account? 
              <Text style={{color: Colors.dark_theme1, fontWeight: 'bold'}}>
                Login
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  genderView:{
    height: hp(10),
    flexDirection: 'row',
    flex:1, 
    justifyContent:'space-evenly'
  },
   male: {
    borderWidth: 2,
    borderColor: Colors.dark_theme3,
    width: '40%',
    height:hp(12), 
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius:10
  },
  heading: {
    color: Colors.dark_theme1,
    alignSelf: 'flex-start',
    textAlign: 'left',
    width: '90%',
    marginBottom: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  btntxt: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },

  logo: {
    borderRadius: 10,
    height:100, width: 100,
  },
  logoText: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
    margin: wp(4),
  },
  button: {
    width: '90%',
    height: hp(6),
    alignSelf: 'center',
    margin: wp(4),
    borderRadius: 10,
  },
});
