import React, {useState} from 'react';
import {
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
const Login = ({navigation, onClicks, onGoregister}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badEmail, setBadEmail] = useState('');
  const [badPassword, setBadPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
        // showMessage({
        //   message: responseData?.message,
        //   type: responseData.status ? 'success' : 'danger',
        //   backgroundColor: responseData.status ? 'green' : 'red', // background color
        //   icon: responseData.status ? 'success' : 'danger', // background color
        //   color: '#fff', // text color
        // });
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
  return (
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
          <Text style={{color: Colors.white, fontWeight: 'bold'}}>Sign Up</Text>
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
