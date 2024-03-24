import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const FirestAnim = () => {
  const [click, setclick] = useState(false);
  const animastion = useSharedValue(1);
  //   const animatedStyle = useAnimatedStyle(() => {
  //     return {
  //       transform: [
  //         {
  //           translateY: animastion.value,
  //         },
  //       ],
  //     };
  //   });

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(animastion.value, [1, 0], [100, 200]);
    const backgroundColor = interpolateColor(animastion.value, [1, 0], ['orange', 'red']);
    const borderRadius = interpolate(animastion.value, [1, 0], [0, 200]);
    return {
      width: width,
      height: width,
      backgroundColor ,
      borderRadius
    };
  });

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
      <Animated.View
        style={[
          {width: 100, height: 100, backgroundColor: 'orange'},
          animatedStyle,
        ]}></Animated.View>

      <TouchableOpacity
        onPress={() => {
          if (click) {
            animastion.value = withTiming(0 , {duration: 700});
          } else {
            animastion.value = withSpring(1);
          }
          setclick(!click);
        }}
        style={{
          width: 100,
          height: 30,
          alignItems: 'center',
          margin: 10,
          borderWidth: 2,
        }}>
        <Text>start animastion</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FirestAnim;

const styles = StyleSheet.create({});
