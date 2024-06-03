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

const OtpScreen = ({handleOtpSumbit, email, changeVisible}) => {
  const otpInputRefs = Array.from({length: 4}, () => useRef(null));
  const [otp, setOtp] = useState('');
  const [ganrated, setganrated] = useState('');
  const [issend, setisSend] = useState(false);
  const [seconds, setSeconds] = useState(60); // Initial value for seconds

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
        console.log('setisSend true');
        console.log(res),
          console.log(res?.data),
          setisSend(true),
          setSeconds(60);
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

  useEffect(() => {
    callLogin();
  }, []);

  return (
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
          if (otp == ganrated) {
            handleOtpSumbit(true);
          } else {
            handleOtpSumbit(false);
          }
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
        onPress={() => changeVisible()}>
        Edit Email?
      </Text>
    </View>
  );
};

export default OtpScreen;

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
