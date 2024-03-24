import React, { useCallback } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View
} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { ImagePath } from '../utils/Strings';

const ImageComappoennt = Animated.createAnimatedComponent(Image);
const LikeAnimation = () => {
  const scale = useSharedValue(0);

  const dobleTab = useCallback(() => {
    scale.value = withSpring(1, undefined, isFinish => {
      if (isFinish) {
        scale.value = withDelay(100, withSpring(0));
      }
    })
  }, []);

  const animatedStle = useAnimatedStyle(() => {
    return {
      transform: [{scale: Math.max(scale.value, 0)}],
    };
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TapGestureHandler maxDelayMs={250} numberOfTaps={2} onActivated={dobleTab} >
          <Animated.View >
            <ImageBackground
              source={ImagePath.macicon}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageComappoennt
                source={ImagePath.hearticon}
                style={[{width: 100, height: 100, tintColor: 'red'}, animatedStle]}
              />
            </ImageBackground>
          </Animated.View>
        </TapGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

export default LikeAnimation;

const styles = StyleSheet.create({});
