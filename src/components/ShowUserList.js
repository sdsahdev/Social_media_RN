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
  StyleSheet,
} from 'react-native';
import BouncyCheckbox from '@react-native-community/checkbox';
import {Colors} from '../utils/Colors';
import {ImagePath} from '../utils/Strings';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';

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
                value={tempceck}
                tintColors={{true: Colors.white, false: Colors.white}}
                disabled={true}
              />
            </View>
            <View style={{width: '90%', borderBottomWidth: 0.1}}>
              <View onPress={() => handleCheckboxPress(item)}>
                <Text style={{fontSize: 16, color: Colors.white}}>
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
          style={styles.mainbg}
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
              <View style={styles.flatview}>
                <View style={[, {width: '100%'}]}>
                  <TouchableOpacity style={[{width: '100%'}]}>
                    <Text style={styles.titletxt}>{title}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputmainview}>
                  <View style={styles.seachinputview}>
                    <TextInput
                      placeholder="Search"
                      placeholderTextColor={Colors.white}
                      style={[{width: 300, fontSize: 20, color: Colors.white}]}
                      value={search}
                      onChangeText={text => {
                        searchText(text);
                      }}
                    />
                    <Image
                      source={ImagePath.searchicon}
                      style={styles.searchicon}
                    />
                  </View>
                </View>
                <View style={styles.userview}>
                  {temp_arr?.map((data, index) => {
                    return (
                      <View key={index} style={styles.closebtn}>
                        <Text style={styles.usertxt}>{data.username}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            if (temp_arr.includes(data)) {
                              const newArr = temp_arr.filter(value => {
                                return value !== data;
                              });
                              settemp_arr(newArr);
                            }
                          }}>
                          <Image
                            source={ImagePath.closeicon}
                            style={styles.closeicon}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

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

          <View style={styles.bntnview}>
            <TouchableOpacity
              onPress={() => {
                setObjList(array);
                settemp_arr(arr);
                onPressCancel();
              }}
              style={styles.bottombtn}>
              <Text style={styles.btntxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                temp_arr.length > 0 && onPress(temp_arr),
                  setObjList(array),
                  setArr(temp_arr);
              }}
              style={styles.bottombtn}>
              <Text style={styles.btntxt}>Create</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  },
);
const styles = StyleSheet.create({
  btntxt: {fontSize: 16, color: Colors.black},
  mainbg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
  },
  flatview: {
    backgroundColor: Colors.black,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  titletxt: {
    color: Colors.white,
    fontSize: 20,
    padding: 10,
    textAlignVertical: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  inputmainview: {
    marginBottom: -20,
    color: Colors.white,
    fontSize: 15,
    padding: 10,
    textAlignVertical: 'center',
  },
  seachinputview: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  usertxt: {
    fontSize: 16,
    color: Colors.white,
    paddingHorizontal: 5,
  },
  closeicon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  searchicon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: Colors.white,
  },
  userview: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    alignItems: 'center',
    margin: 10,
  },
  closebtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: Colors.black,
    borderRadius: 8,
    padding: 4,
    margin: 4,
  },
  bottombtn: {
    backgroundColor: Colors.white,
    flex: 1,
    width: '90%',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: heightPercentageToDP(7),
  },
  bntnview: {
    width: '100%',
    height: heightPercentageToDP(10),
    flexDirection: 'row',
  },
  dontbtn: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
});

export default ShowUserList;
