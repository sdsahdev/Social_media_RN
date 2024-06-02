import React, {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CustomTextInput from '../components/CustomTextInput';
import Loader from '../components/Loader';
import {setAuthdata, setToken} from '../redux/Slice/AuthSlice';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import axios from 'axios';
import OtpScreen from './OtpScreen';
const Login = ({navigation, onClicks, onGoregister}) => {
  const [email, setEmail] = useState('devdev@gamil.com');

  const [password, setPassword] = useState('123456');
  const [badEmail, setBadEmail] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setvisible] = useState(0);
  const [craeteNewPassword, setcraeteNewPassword] = useState('');
  const [createbas, setcreatebad] = useState('');
  const [confirmeNewPassword, setconfirmeNewPassword] = useState('');

  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth);

  const validate = () => {
    let isValided = false;
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

    return isValided;
  };

  const passwordvalidate = () => {
    let isValidedpassword = false;
    if (craeteNewPassword == '') {
      isValidedpassword = false;
      setcreatebad('Please Enter Password');
    } else if (craeteNewPassword.length <= 5) {
      setcreatebad('Please Enter Min 6 charaters  Password ');
      isValidedpassword = false;
    } else if (craeteNewPassword != '' && craeteNewPassword.length >= 6) {
      isValidedpassword = true;
      setcreatebad('');
    }
    return isValidedpassword;
  };
  const login = () => {
    setLoading(true);
    console.log(BASE_URL + API_URLS.LOGIN_URL);
    fetch(BASE_URL + API_URLS.LOGIN_URL, {
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
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
        showMessage({
          message: responseData?.message,
          type: responseData.status ? 'success' : 'danger',
          backgroundColor: responseData.status ? 'green' : 'red', // background color
          icon: responseData.status ? 'success' : 'danger', // background color
          color: '#fff', // text color
        });
        console.log(responseData);
        if (responseData.status) {
          dispatch(setAuthdata(responseData));
          dispatch(setToken(responseData.token));
          navigation.navigate(RoutesName.BottomTab);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const handleOtpSumbit = event => {
    console.log(event);
    if (event) {
      setvisible(3);
      console.log('login successfully');
    } else {
      Alert.alert(
        'Otp not matched',
        'Please enter correct otp',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };
  const changePassword = () => {
    console.log(email);
    console.log(craeteNewPassword);
    try {
      setLoading(true);
      const body = {
        email: email,
        newPassword: craeteNewPassword,
      };
      axios
        .post(`${BASE_URL}${API_URLS.CHANGE_PASSWORD_URL}`, body)
        .then(response => {
          setvisible(0);
          console.log(response.data, '==response delete=====');
        })
        .catch(error => {
          showMessage({
            message: error?.response?.data?.error
              ? error?.response?.data?.error
              : 'Try again later. Something went wrong.',
            type: 'danger',
            backgroundColor: 'red',
            icon: 'danger',
            color: '#fff',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      console.log(e, '===error ===');
    }
  };

  return (
    <View style={styles.container}>
      {visible == 1 ? (
        <>
          <CustomTextInput
            customErrorTxtStyle={{color: Colors.white}}
            customTxtStyle={{color: Colors.white}}
            icon={require('../Images/mail.png')}
            placeholder={'Enter Email'}
            value={email}
            onChangeText={txt => setEmail(txt)}
            isValide={badEmail == '' ? true : false}
            errorMessage={badEmail}
          />

          <LinearGradient
            colors={[Colors.blue2, Colors.blue1]}
            style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                if (email) {
                  setvisible(2);
                }
              }}
              style={[
                styles.button,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 0,
                },
              ]}>
              <Text style={styles.btntxt}>Send</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => {
              setvisible(0);
            }}>
            <Text style={{color: Colors.white, fontSize: 16, marginTop: 8}}>
              Go Back
            </Text>
          </TouchableOpacity>
        </>
      ) : null}
      {visible == 3 ? (
        <>
          <CustomTextInput
            icon={ImagePath.lockicon}
            placeholder={'Create Password'}
            value={craeteNewPassword}
            onChangeText={txt => setcraeteNewPassword(txt)}
            isValide={createbas == '' ? true : false}
            errorMessage={createbas}
          />

          <LinearGradient
            colors={[Colors.blue2, Colors.blue1]}
            style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                if (passwordvalidate()) {
                  changePassword();
                  // 1 changePassword API calling ==> in navigate to bottomtabscreen
                } else {
                  console.log('else');
                }
              }}
              style={[
                styles.button,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 0,
                },
              ]}>
              <Text style={styles.btntxt}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => {
              setvisible(0);
            }}>
            <Text style={{color: Colors.white, fontSize: 16, marginTop: 8}}>
              Go Back
            </Text>
          </TouchableOpacity>
        </>
      ) : null}
      {visible == 2 ? (
        <>
          <OtpScreen
            handleOtpSumbit={event => handleOtpSumbit(event)}
            changeVisible={() => setvisible(1)}
            email={email}
          />
        </>
      ) : null}
      {visible == 0 ? (
        <View style={styles.container}>
          <CustomTextInput
            customErrorTxtStyle={{color: Colors.white}}
            customTxtStyle={{color: Colors.white}}
            icon={require('../Images/mail.png')}
            placeholder={'Enter Email'}
            value={email}
            onChangeText={txt => setEmail(txt)}
            isValide={badEmail == '' ? true : false}
            errorMessage={badEmail}
          />

          <CustomTextInput
            customErrorTxtStyle={{color: Colors.white}}
            customTxtStyle={{color: Colors.white}}
            icon={ImagePath.lockicon}
            placeholder={'Enter Password'}
            value={password}
            onChangeText={txt => setPassword(txt)}
            isValide={badPassword == '' ? true : false}
            errorMessage={badPassword}
          />

          <LinearGradient
            colors={[Colors.blue2, Colors.blue1]}
            style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                if (validate()) {
                  login();
                }
              }}
              style={[
                styles.button,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 0,
                },
              ]}>
              <Text style={styles.btntxt}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => {
              onGoregister();
            }}>
            <Text style={{color: Colors.white, fontSize: 16, marginTop: 8}}>
              Create new account?{' '}
              <Text style={{color: Colors.white, fontWeight: 'bold'}}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setvisible(1);
            }}>
            <Text style={{color: Colors.white, fontSize: 16, marginTop: 8}}>
              Forget Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onClicks();
            }}>
            <Text style={{color: Colors.white, fontSize: 16, marginTop: 8}}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'red',
    flex: 1,
    height: 200,
    width: 200,
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
