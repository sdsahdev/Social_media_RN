import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../utils/Colors';
import { API_URLS, BASE_URL } from '../utils/Strings';

const Comment = () => {
  const auth = useSelector(state => state.auth);

  const [comment, setComment] = useState('');

  const postComment = () => {
    setloading(true);
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = {
        "comment":"super cool nice baby",
        "userId":"65fc0bcb16c127129e5dcd94",
        "postId":"65fc1690e6503cfc503712c9",
        "username":"devnreuser"
    };
    axios
      .put(BASE_URL + API_URLS.ADD_COMMENT + `/` + item._id, body)
      .then(response => {
        console.log(response.data, '==response delete====='),
          setloading(false),
          featchData();
      })
      .catch(error => {
        console.log(error, '=====error delete==='), setloading(false);
      });
  }


 
  return (
    <View style={styles.container}>
      <View style={styles.bottomView}>
        <TextInput
          style={styles.input}
          placeholder="Type comment here..."
          value={comment}
          onChangeText={txt => setComment(txt)}
        />
        <TouchableOpacity disabled={comment == '' ? true : false} style={[styles.postbtn, {backgroundColor:comment ==''?Colors.placeColor : Colors.dark_theme3}]}>
          <Text style={styles.btntxt}> comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.background,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    lignItems: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    width: '70%',
    height: '100%',
  },
  postbtn: {
    width: '20%',
    height: '60%',
    backgroundColor: Colors.dark_theme2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: Colors.white,
  },
});
