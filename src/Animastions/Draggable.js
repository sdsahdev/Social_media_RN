import { StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GestureHandlerRootView, PanGestureHandler} from 'react-native-gesture-handler'
import Animated, {useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, } from'react-native-reanimated';
const Draggable = () => {
const x = useSharedValue(0)
const y = useSharedValue(0)
    const geatureHandler = useAnimatedGestureHandler({
        onStart: (e,c) => {
            c.startX = x.value
            c.startY = y.value
        },
        onActive: (e,c) => {
            x.value = c.startX+e.translationX; 
            y.value = c.startY+e.translationY; 
        },
        onEnd: (e,c) => {
            x.value = withTiming(0 , {duration:1000})
            y.value = withTiming(0 , {duration:1000})
        },
    })
    // const animatedStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [
    //             {
    //                 translateX: x.value,
    //                 translateY: y.value,
    //             },
    //         ],
    //     }
    // })
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: x.value },
                { translateY: y.value },
            ],
        }
    })
    
  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <View style={{flex:1}}>

        <PanGestureHandler onGestureEvent={geatureHandler}>
            
      <Animated.View style={[{width: 200, height: 200, backgroundColor: 'orange'},animatedStyle]}>

      </Animated.View >
        </PanGestureHandler>
        </View>
    </GestureHandlerRootView>
  );
};

export default Draggable;

const styles = StyleSheet.create({});
