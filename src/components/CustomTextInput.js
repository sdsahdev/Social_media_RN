import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from '../utils/Colors';

const CustomTextInput = ({
  mt,
  placeholder,
  onChangeText,
  isValide,
  keyboardType,
  maxLenght,
  value,
  icon,
  errorMessage,
  customTxtStyle,
  customErrorTxtStyle,
}) => {
  return (
    <View style={{width: '90%', height: 70, margin: 4}}>
      <View
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: 'row',
          borderColor: isValide ? Colors.white : Colors.red,
        }}>
        {icon ? (
          <Image
            source={icon}
            style={{
              width: wp(6),
              height: wp(6),
              margin: wp(4),
              tintColor: Colors.white,
            }}
          />
        ) : null}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.white}
          value={value}
          onChangeText={onChangeText}
          style={[{width: '80%', color: Colors.white}, customTxtStyle]}
          keyboardType={keyboardType ? keyboardType : 'default'}
        />
      </View>
      {errorMessage != '' ? (
        <Text
          style={[
            {
              color: Colors.white,
              fontSize: 13,
              textAlign: 'left',
              alignSelf: 'flex-start',
            },
            customErrorTxtStyle,
          ]}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({});
