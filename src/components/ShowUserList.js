import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import BouncyCheckbox from '@react-native-community/checkbox';
import {Colors} from '../utils/Colors';
import {ImagePath} from '../utils/Strings';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const ShowUserList = memo(
  ({state, onPress, array, onPressCancel, selectedItems, title, search}) => {
    const [objList, setObjList] = useState(array);
    const [arr, setArr] = useState(selectedItems);
    const [temp_arr, settemp_arr] = useState(selectedItems);
    const searchText = text => {
      const searchList = array?.filter(value =>
        value?.username?.toLowerCase()?.includes(text?.toLowerCase()),
      );
      setObjList(searchList);
    };

    useEffect(() => {
      setObjList(array);
    }, [array]);

    const handleCheckboxPress = useCallback(item => {
      settemp_arr(prevArr =>
        prevArr?.includes(item)
          ? prevArr.filter(value => value !== item)
          : [...prevArr, item],
      );
    }, []);

    const renderItem = useCallback(
      ({item}) => {
        const tempceck = temp_arr?.includes(item);
        return (
          <TouchableOpacity
            onPress={() => handleCheckboxPress(item)}
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <View style={{width: '10%'}}>
              <BouncyCheckbox
                style={{tintColor: '#fff'}}
                value={tempceck}
                tintColors={{true: Colors.blue, false: 'black'}}
                disabled={true}
              />
            </View>
            <View style={{width: '90%', borderBottomWidth: 0.1}}>
              <View onPress={() => handleCheckboxPress(item)}>
                <Text style={{fontSize: 16, color: 'black'}}>
                  {item.username}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      },
      [temp_arr, handleCheckboxPress],
    );

    return (
      <Modal visible={state} animationType="fade" transparent={true}>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.white,
          }}
          onPress={() => {
            setObjList(array);
            settemp_arr(arr);
            onPressCancel();
          }}>
          <ScrollView
            nestedScrollEnabledm
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            <TouchableWithoutFeedback style={{borderRadius: 15}}>
              <View
                style={[
                  {
                    backgroundColor: Colors.dark_theme4,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <View style={[, {width: '100%'}]}>
                  <TouchableOpacity style={[{width: '100%'}]}>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 20,
                        padding: 10,
                        textAlignVertical: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                      {title}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    {
                      marginBottom: -20,
                      color: Colors.white,
                      fontSize: 15,
                      padding: 10,
                      textAlignVertical: 'center',
                    },
                  ]}>
                  <View
                    style={{
                      borderBottomColor: Colors.dark_theme1,
                      borderBottomWidth: 1,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      placeholder="Search"
                      style={[{width: 300, fontSize: 20}]}
                      value={search}
                      onChangeText={text => {
                        searchText(text);
                      }}
                    />
                    <Image
                      source={ImagePath.searchicon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </View>
                <View
                  style={[
                    {
                      width: '100%',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      padding: 10,
                      alignItems: 'center',
                      margin: 10,
                    },
                  ]}>
                  {temp_arr?.map((data, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 15,
                            backgroundColor: Colors.white,
                            borderRadius: 8,
                            padding: 4,
                            margin: 4,
                          },
                        ]}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: Colors.black,
                            paddingHorizontal: 5,
                          }}>
                          {data.username}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            if (temp_arr.includes(data)) {
                              const newArr = temp_arr.filter(value => {
                                return value !== data;
                              });
                              console.log(newArr, 'newArr');
                              settemp_arr(newArr);
                            } else {
                              console.log(data, 'else');
                              console.log(arr, 'else');
                              console.log(temp_arr, 'else');
                            }
                          }}>
                          <Image
                            source={ImagePath.closeicon}
                            style={{
                              width: 14,
                              height: 14,
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

                <TouchableOpacity
                  onPress={isChecked => {
                    setArr([]);
                    settemp_arr([]);
                  }}
                  style={[
                    // Theme.row, Theme.alignCenter, Theme.padding10,
                    {
                      flexDirection: 'row',
                      padding: 10,
                      alignItems: 'center',
                    },
                  ]}>
                  <View style={{width: '10%'}}>
                    <BouncyCheckbox
                      disabled={true}
                      tintColors={{true: Colors.blue, false: 'black'}}
                      onChange={temp_arr?.length === 0 ? true : false}
                    />
                  </View>
                  <View style={{width: '90%'}}>
                    <Text style={{fontSize: 16, color: Colors.black}}>
                      Doesn't matter
                    </Text>
                  </View>
                </TouchableOpacity>
                <FlatList
                  scrollEnabled={false}
                  keyExtractor={item => item._id}
                  data={objList}
                  initialNumToRender={10}
                  windowSize={100}
                  renderItem={renderItem}
                />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          <View
            style={{
              width: '100%',

              height: heightPercentageToDP(10),
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                setObjList(array);
                settemp_arr(arr);
                onPressCancel();
              }}
              style={{
                backgroundColor: 'blue',
                flex: 1,
                width: '100%',
                borderRadius: 10,
                margin: 4,
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 16, color: Colors.white}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onPress(temp_arr);
                setObjList(array);
                setArr(temp_arr);
              }}
              style={{
                backgroundColor: 'blue',
                flex: 1,
                width: '100%',
                borderRadius: 10,
                margin: 4,
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 16, color: Colors.white}}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  },
);

export default ShowUserList;
