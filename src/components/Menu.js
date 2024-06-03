import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ImagePath} from '../utils/Strings';
import {Colors} from '../utils/Colors';

const Menu = ({icon, name, onpress}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onpress()}>
        <View style={styles.mainView}>
          <View style={{flexDirection: 'row'}}>
            <Image source={icon} style={styles.imgicon} />
            <Text style={styles.name}>{name}</Text>
          </View>
          <View>
            <Image
              source={ImagePath.back}
              resizeMode="center"
              style={styles.arrow}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: wp(4),
    marginVertical: hp(1),
    borderRadius: wp(2),
    borderColor: Colors.black,
    borderWidth: 1,
  },
  imgicon: {
    height: hp(4),
    width: wp(20),
    resizeMode: 'contain',
    marginVertical: hp(2),
  },
  name: {fontSize: wp(5), color: '#000', alignSelf: 'center'},
  arrow: {
    width: wp(5),
    height: hp(2),
    justifyContent: 'flex-end',
    marginRight: wp(4),
  },
});
