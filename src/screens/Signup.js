import React, {useState, useRef, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import CustomTextInput from '../components/CustomTextInput';
import Loader from '../components/Loader';
import {setAuthdata} from '../redux/Slice/AuthSlice';
import {Colors} from '../utils/Colors';
import {API_URLS, BASE_URL, ImagePath, RoutesName} from '../utils/Strings';
import axios from 'axios';

const Signup = ({navigation, onClicks}) => {
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

  const otpInputRefs = Array.from({length: 4}, () => useRef(null));
  const [otp, setOtp] = useState('');
  const [ganrated, setganrated] = useState('');
  const [issend, setisSend] = useState(false);
  const [seconds, setSeconds] = useState(60); // Initial value for seconds
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
    } else {
      isValided = true;
      setBadMobile('');
    }

    // UserName
    if (username == '') {
      isValided = false;
      setBadUsername('Please Enter Username');
    } else {
      isValided = true;
      setBadUsername('');
    }

    // gender

    return isValided;
  };
  useEffect(() => {
    // Timer to decrement seconds every second
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    // Clear the timer when component unmounts
    return () => clearInterval(timer);
  }, [seconds]);
  const register = () => {
    setLoading(true);
    console.log(BASE_URL + API_URLS.REGISTER_URL);
    fetch(BASE_URL + API_URLS.REGISTER_URL, {
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
        username: username,
        mobile: mobile,
        gender: selectedGender == 0 ? 'Male' : 'Female',
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
          backgroundColor: responseData.status ? 'green' : 'red', // background color
          icon: responseData.status ? 'success' : 'danger', // background color
          color: '#fff', // text color
        });
        if (responseData.status) {
          dispatch(setAuthdata(responseData));
          navigation.navigate(RoutesName.BottomTab);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error, '==error==');
        console.log(error?.response);
      });
  };

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
  };
  const callLogin = async () => {
    const ganratedOtp = generateOTP();
    setganrated(ganratedOtp);

    const url = BASE_URL + API_URLS.SEND_OTP;
    console.log(email, '==url==');
    const body = {
      email: email,
      otp: ganratedOtp,
    };
    axios
      .post(url, body)
      .then(res => {
        console.log(res.data),
          setisSend(true),
          setSeconds(60),
          console.log('setisSend true');
      })
      .catch(e => console.log(e?.response?.data));
  };
  const handleOtpChange = (index, text) => {
    const sanitizedText = text.replace(/[^0-9]/g, '').slice(0, 1);

    setOtp(prevOtp => {
      const newOtp = prevOtp.split('');
      newOtp[index] = sanitizedText;
      return newOtp.join('');
    });

    // Move to the previous input if the current input is empty
    if (text === '' && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }

    // Move to the next input if availables
    else if (text !== '' && index < otpInputRefs.length - 1) {
      otpInputRefs[index + 1]?.current?.focus();
    } else {
      if (index != 0) {
        otpInputRefs[otp.length + 1]?.current?.focus();
      }
    }
  };

  const handleOtpSumbit = () => {
    if (otp == ganrated) {
      register();
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

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {!issend ? (
          <View style={styles.container}>
            <Loader visible={loading} />

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
                <View style={styles.genderView}>
                  <TouchableOpacity
                    onPress={() => {
                      setselectedGender(0);
                    }}
                    style={[
                      styles.male,
                      {
                        borderColor:
                          selectedGender == 0
                            ? Colors.white
                            : 'rgba(5,54,97,0.24)',
                        backgroundColor:
                          selectedGender == 0
                            ? Colors.blue2
                            : 'rgba(5,54,97,0.24)',
                      },
                    ]}>
                    <Image
                      source={ImagePath.manicon}
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'cover',
                        tintColor:
                          selectedGender == 0 ? Colors.white : Colors.black,
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setselectedGender(1);
                    }}
                    style={[
                      styles.male,
                      {
                        borderColor:
                          selectedGender == 1
                            ? Colors.white
                            : 'rgba(5,54,97,0.24)',
                        backgroundColor:
                          selectedGender == 1
                            ? Colors.blue2
                            : 'rgba(5,54,97,0.24)',
                      },
                    ]}>
                    <Image
                      source={ImagePath.girlicon}
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'cover',
                        tintColor:
                          selectedGender == 1 ? Colors.white : Colors.black,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{flex: 1, width: '100%'}}>
              <LinearGradient
                colors={[Colors.blue2, Colors.blue1]}
                style={styles.button}>
                <TouchableOpacity
                  onPress={() => {
                    if (validate()) {
                      callLogin();
                    }
                  }}
                  style={[
                    styles.button,
                    {justifyContent: 'center', alignItems: 'center', margin: 0},
                  ]}>
                  <Text style={styles.btntxt}>Sign Up</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <TouchableOpacity
              onPress={() => {
                onClicks();
              }}
              style={{flex: 1, marginBottom: 10}}>
              <Text style={{color: Colors.white, fontSize: 16}}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.otpContainer}>
                {Array.from({length: 4}).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={otpInputRefs[index]}
                    style={[
                      styles.inputotp,
                      otp.length === index ? styles.inputFocus : null,
                    ]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChangeText={text => handleOtpChange(index, text)}
                  />
                ))}
              </View>

              {seconds <= 0 ? (
                <TouchableOpacity
                  disabled={seconds <= 0 ? false : true}
                  onPress={() => {
                    callLogin(), setOtp(''), setSeconds(0);
                  }}>
                  <Text
                    style={{
                      color: Colors.sky,
                      fontSize: 18,
                      marginTop: 10,
                    }}>
                    Resend
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 12,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  Re-send OTP in {seconds} seconds {`\n`}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                handleOtpSumbit();
                // navigation.navigate(RoutesName.BottomTabScreen)
              }}
              style={styles.btn}>
              <Text style={{color: Colors.white, fontSize: 18}}>Verify</Text>
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                marginTop: 10,
                alignSelf: 'center',
              }}
              onPress={() => setisSend(false)}>
              Edit Email?
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  inputFocus: {
    borderColor: Colors.sky,
    borderWidth: 2, // Highlight the input in focus
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputotp: {
    width: wp(15),
    height: hp(8),
    borderColor: Colors.white,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    fontSize: wp(8),
    textAlign: 'center',
    color: Colors.white,
  },
  genderView: {
    height: hp(10),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  btn: {
    height: 50,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.blue,
    marginTop: 20,
    borderColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  male: {
    borderWidth: 2,
    borderColor: Colors.black3,
    width: '40%',
    height: hp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  heading: {
    color: Colors.white,
    alignSelf: 'flex-start',
    textAlign: 'left',
    width: '90%',
    marginBottom: 4,
  },
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
    height: 100,
    width: 100,
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
