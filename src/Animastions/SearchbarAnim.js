import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ImagePath } from '../utils/Strings';
const SearchbarAnim = () => {
    const [value, setVlaue] = useState(0)
  const animation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: animation.value == 1
        ? withTiming(300, {duration: 500})
        : withTiming(0, {duration: 500}),
    };
  });
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.View
        style={[
          {
            width: 300,
            height: 50,
            backgroundColor: 'gray',
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
          },
          animatedStyle,
        ]}>
        <TextInput style={{width: '85%'}} placeholder="Search here..." />
        <TouchableOpacity
          onPress={() => {
            if (animation.value == 1) {
              animation.value = 0;
              setVlaue(0)
            } else {
              animation.value = 1;
              setVlaue(1)
            }
            console.log(animation.value);
          }}>
          <Image
          resizeMode='center'
            style={ {width: value == 1 ? 30 :20, height: 30}   }
            source={value == 1 ?ImagePath.searchicon : ImagePath.closeicon}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SearchbarAnim;

const styles = StyleSheet.create({});
