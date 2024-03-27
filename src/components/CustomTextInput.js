import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { Colors } from '../utils/Colors';

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
}) => {
  return (
    <View style={{width: '90%', height: 70,margin:4}}>
      <View
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: 'row',
          borderColor: isValide ? Colors.dark_theme3 : Colors.red,
        }}>
        {icon ? (
          <Image
            source={icon}
            style={{
              width: wp(6),
              height: wp(6),
              margin: wp(4),
              tintColor: Colors.dark_theme3,
            }}
          />
        ) : null}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={{width:'80%'}}
          keyboardType={keyboardType ? keyboardType :'default'}
        />
      </View>
      {errorMessage != '' ? (
        <Text
          style={{
            color: Colors.red,
            fontSize: 13,
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({});
